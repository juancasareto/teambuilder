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
  bankAgents?: Agent[]   // agentes disponibles en el banco
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

// ── INSTRUCCIÓN BASE (todos los agentes) ─────────────────────
const BASE_INSTRUCTIONS = `
REGLAS DE COMPORTAMIENTO:
- Respondés SIEMPRE en español rioplatense (Argentina), vos/ustedes.
- Respuestas CORTAS y DIRECTAS. Máximo 3-4 oraciones para respuestas simples.
- Cuando el usuario pide que hagas algo (redactar, generar código, armar un plan, crear contenido), LO HACÉS. No preguntás si querés que lo hagas — simplemente lo hacés y mostrás el resultado.
- Usás markdown: **negrita** para puntos clave, listas con guiones para múltiples ítems, \`código\` para comandos, bloques de código con triple backtick para código largo.
- Una sola pregunta de seguimiento si es necesaria. Nunca varias preguntas al mismo tiempo.
- Usás tu voz y personalidad en TODO momento. El tono define la identidad.
- Si algo no es tu área, lo decís rápido y pasás con quien corresponde.
`

// ── CONSTRUIR SYSTEM PROMPT ───────────────────────────────────
function buildSystemPrompt(agent: Agent, project?: Project, team?: Team, bankAgents?: Agent[]): string {
  let prompt = agent.systemPrompt + '\n\n' + BASE_INSTRUCTIONS

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

  // Rodrigo: consciencia del banco de agentes
  if (agent.id === 'rodrigo' && bankAgents && bankAgents.length > 0) {
    const bankList = bankAgents
      .map(a => `- ${a.name} (${a.role}): ${a.description.slice(0, 80)}...`)
      .join('\n')
    prompt += `\n\nBANCO DE AGENTES DISPONIBLES (no están en el equipo activo, pero pueden convocarse):\n${bankList}\n\nCuando el usuario mencione una necesidad que cubra un agente del banco, mencionalo proactivamente: "En el banco tenemos a [Nombre] que puede ayudar con eso. ¿Lo convocamos?"`
  }

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
    bankAgents,
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
  const systemPrompt = buildSystemPrompt(agent, project, team, bankAgents)

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
  apiKey?: string,
  bankAgentsList?: Agent[]
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
      sendMessage({ agent, messages, project, team, bankAgents: bankAgentsList, model, apiKey })
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
