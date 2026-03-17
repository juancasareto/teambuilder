// ============================================================
// TEAMBUILDER — useChat hook
// Matías · v0.1
// Gestiona mensajes, agentes activos y llamadas a la API
// ============================================================

import { useState, useCallback } from 'react'
import { sendMessage, sendToTeam, toAgentMessages, MODELS } from '../lib/claude'
import type { Agent } from '../types/agent'
import type { ChatMessage, Project, Team } from '../types/project'


function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export type ChatMode = 'normal' | 'meeting'

export interface AgentState {
  agent: Agent
  status: 'listening' | 'raising' | 'speaking'
  pendingOpinion?: string
}

export function useChat(
  activeAgents: Agent[],
  project?: Project,
  team?: Team,
  tier = 'free',
  apiKey?: string
) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(
    () => Object.fromEntries(
      activeAgents.map(a => [a.id, { agent: a, status: 'listening' }])
    )
  )
  const [mode, setMode] = useState<ChatMode>('normal')
  const [isLoading, setIsLoading] = useState(false)
  const [excludeRodrigo, setExcludeRodrigo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const model = MODELS[tier as keyof typeof MODELS] ?? MODELS.free

  // ── Agregar mensaje del usuario ──────────────────────────
  const addUserMessage = useCallback((content: string): ChatMessage => {
    const msg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      content,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  // ── Detectar agente mencionado (@Nombre) ─────────────────
  const detectMention = useCallback((text: string): Agent | null => {
    const match = text.match(/@(\w+)/)?.[1]?.toLowerCase()
    if (!match) return null
    return activeAgents.find(a => a.name.toLowerCase() === match) ?? null
  }, [activeAgents])

  // ── Enviar mensaje ───────────────────────────────────────
  const sendUserMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return
    setError(null)
    setIsLoading(true)

    addUserMessage(content)

    try {
      const history = toAgentMessages(messages)
      const userMsg: import('../lib/claude').AgentMessage = { role: 'user', content }

      if (mode === 'meeting') {
        // Modo reunión: responden todos (excepto Rodrigo si está excluido)
        const respondingAgents = activeAgents.filter(
          a => !(excludeRodrigo && a.id === 'rodrigo')
        )

        // Marcar todos como "speaking"
        setAgentStates(prev => {
          const next = { ...prev }
          respondingAgents.forEach(a => { next[a.id] = { agent: a, status: 'speaking' } })
          return next
        })

        const results = await sendToTeam(
          respondingAgents,
          content,
          messages,
          project,
          team,
          model,
          apiKey
        )

        results.forEach(result => {
          const msg: ChatMessage = {
            id: generateId(),
            sender: result.agentId,
            content: result.content,
            timestamp: Date.now(),
            likes: 0,
            dislikes: 0,
          }
          setMessages(prev => [...prev, msg])
        })

        // Volver todos a "listening"
        setAgentStates(prev => {
          const next = { ...prev }
          respondingAgents.forEach(a => { next[a.id] = { agent: a, status: 'listening' } })
          return next
        })

      } else {
        // Modo normal: responde el agente mencionado o Rodrigo por defecto
        const mentioned = detectMention(content)
        const rodrigo = activeAgents.find(a => a.id === 'rodrigo')
        const respondingAgent = mentioned ?? (excludeRodrigo ? null : rodrigo)

        if (!respondingAgent) return

        setAgentStates(prev => ({
          ...prev,
          [respondingAgent.id]: { agent: respondingAgent, status: 'speaking' },
        }))

        const result = await sendMessage({
          agent: respondingAgent,
          messages: [...history, userMsg],
          project,
          team,
          model,
          apiKey,
        })

        const msg: ChatMessage = {
          id: generateId(),
          sender: result.agentId,
          content: result.content,
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
        }
        setMessages(prev => [...prev, msg])

        setAgentStates(prev => ({
          ...prev,
          [respondingAgent.id]: { agent: respondingAgent, status: 'listening' },
        }))

        // Simular que otros agentes pueden "levantar la mano"
        // (lógica básica por keywords en v0.1)
        const keywords: Record<string, string[]> = {
          tomas: ['bug', 'test', 'error', 'falla', 'crash'],
          santiago: ['diseño', 'ui', 'componente', 'pantalla', 'color'],
          facundo: ['arquitectura', 'estructura', 'escala', 'patrón'],
          matias: ['api', 'endpoint', 'backend', 'servidor', 'base de datos'],
          lucia: ['ux', 'flujo', 'usuario', 'experiencia', 'fricción'],
          bautista: ['idea', 'bloqueado', 'creativo', 'alternativa'],
          gonzalo: ['integración', 'webhook', 'api externa', 'conectar'],
          ramiro: ['copy', 'texto', 'narrativa', 'historia', 'mensaje'],
        }

        const lowerContent = content.toLowerCase()
        activeAgents.forEach(agent => {
          if (agent.id === respondingAgent.id) return
          const agentKeywords = keywords[agent.id] ?? []
          if (agentKeywords.some(kw => lowerContent.includes(kw))) {
            // Generar opinión del agente
            sendMessage({
              agent,
              messages: [...history, userMsg],
              project,
              team,
              model,
              apiKey,
              maxTokens: 200, // Opinión corta
            }).then(opinion => {
              setAgentStates(prev => ({
                ...prev,
                [agent.id]: {
                  agent,
                  status: 'raising',
                  pendingOpinion: opinion.content,
                },
              }))
            }).catch(() => {/* silencioso */})
          }
        })
      }
    } catch (err: unknown) {
      const e = err as { status?: number }
      if (e?.status === 429) {
        setError('Demasiadas consultas seguidas. Esperá un momento.')
      } else {
        setError('Algo salió mal. Rodrigo lo está revisando.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    isLoading, messages, mode, activeAgents,
    excludeRodrigo, project, team, model, apiKey,
    addUserMessage, detectMention
  ])

  // ── Like / Dislike ───────────────────────────────────────
  const likeMessage = useCallback((id: string) => {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m)
    )
  }, [])

  const dislikeMessage = useCallback((id: string) => {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, dislikes: m.dislikes + 1 } : m)
    )
  }, [])

  // ── Leer opinión de agente que levantó la mano ───────────
  const readPendingOpinion = useCallback((agentId: string) => {
    const opinion = agentStates[agentId]?.pendingOpinion
    if (!opinion) return null

    const msg: ChatMessage = {
      id: generateId(),
      sender: agentId,
      content: opinion,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
    }
    setMessages(prev => [...prev, msg])
    setAgentStates(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], status: 'listening', pendingOpinion: undefined },
    }))

    return msg
  }, [agentStates])

  // ── Convocar / terminar reunión ──────────────────────────
  const toggleMeeting = useCallback(() => {
    setMode(prev => prev === 'meeting' ? 'normal' : 'meeting')
  }, [])

  return {
    messages,
    agentStates,
    mode,
    isLoading,
    error,
    excludeRodrigo,
    setExcludeRodrigo,
    sendUserMessage,
    likeMessage,
    dislikeMessage,
    readPendingOpinion,
    toggleMeeting,
    clearError: () => setError(null),
  }
}
