// ============================================================
// TEAMBUILDER — Claude API Wrapper
// Matías · Backend · v0.1
// Retry con backoff exponencial + caché de respuestas
// ============================================================

import Anthropic from '@anthropic-ai/sdk'
import type { Agent } from '../types/agent'
import type { ChatMessage, Project, Team } from '../types/project'
import { cache } from './cache'

// ── CLIENTE ──────────────────────────────────────────────────
const getClient = (apiKey?: string) =>
  new Anthropic({
    apiKey: apiKey ?? import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
    dangerouslyAllowBrowser: true,
  })

// ── MODELOS POR PLAN ─────────────────────────────────────────
export const MODELS = {
  free: 'claude-haiku-4-5',
  pro: 'claude-sonnet-4-6',
  enterprise: 'claude-sonnet-4-6',
} as const

// ── TIPOS ────────────────────────────────────────────────────
export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SendMessageOptions {
  agent: Agent
  messages: AgentMessage[]
  project?: Project
  team?: Team
  model?: string
  apiKey?: string
  maxTokens?: number
}

export interface SendMessageResult {
  content: string
  agentId: string
  cached: boolean
  tokensUsed?: number
}

// ── CONSTRUIR SYSTEM PROMPT ───────────────────────────────────
function buildSystemPrompt(agent: Agent, project?: Project, team?: Team): string {
  let prompt = agent.systemPrompt

  // Reemplazar placeholders
  prompt = prompt.replace(
    '{project}',
    project
      ? `${project.name} — ${project.goal}`
      : 'Sin proyecto definido aún'
  )

  prompt = prompt.replace(
    '{team}',
    team
      ? team.agents.map(a => `${a.name} (${a.role})`).join(', ')
      : 'Equipo por definir'
  )

  return prompt
}

// ── WAIT HELPER ───────────────────────────────────────────────
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ── SEND CON RETRY ───────────────────────────────────────────
async function sendWithRetry(
  options: SendMessageOptions,
  retries = 3,
  delayMs = 1000
): Promise<SendMessageResult> {
  const {
    agent,
    messages,
    project,
    team,
    model = MODELS.free,
    apiKey,
    maxTokens = 1024,
  } = options

  // Verificar caché primero
  const cacheKey = cache.buildKey(agent.id, messages)
  const cached = cache.get<string>(cacheKey)
  if (cached) {
    return { content: cached, agentId: agent.id, cached: true }
  }

  const client = getClient(apiKey)
  const systemPrompt = buildSystemPrompt(agent, project, team)

  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const content =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Guardar en caché
    cache.set(cacheKey, content)

    return {
      content,
      agentId: agent.id,
      cached: false,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    }
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }

    // Rate limit — esperar y reintentar
    if (apiError?.status === 429 && retries > 0) {
      await wait(delayMs)
      return sendWithRetry(options, retries - 1, delayMs * 2)
    }

    // Error del servidor — reintentar
    if (apiError?.status && apiError.status >= 500 && retries > 0) {
      await wait(delayMs)
      return sendWithRetry(options, retries - 1, delayMs * 2)
    }

    throw error
  }
}

// ── SEND MESSAGE (API pública) ────────────────────────────────
export async function sendMessage(
  options: SendMessageOptions
): Promise<SendMessageResult> {
  return sendWithRetry(options)
}

// ── SEND A MÚLTIPLES AGENTES (reunión) ───────────────────────
export async function sendToTeam(
  agents: Agent[],
  userMessage: string,
  history: ChatMessage[],
  project?: Project,
  team?: Team,
  model?: string,
  apiKey?: string
): Promise<SendMessageResult[]> {
  const messages: AgentMessage[] = [
    ...history.map(m => ({
      role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ]

  // Enviar en paralelo a todos los agentes
  const results = await Promise.allSettled(
    agents.map(agent =>
      sendMessage({ agent, messages, project, team, model, apiKey })
    )
  )

  return results
    .filter((r): r is PromiseFulfilledResult<SendMessageResult> => r.status === 'fulfilled')
    .map(r => r.value)
}

// ── CONVERTIR ChatMessage[] a AgentMessage[] ─────────────────
export function toAgentMessages(messages: ChatMessage[]): AgentMessage[] {
  return messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.content,
  }))
}
