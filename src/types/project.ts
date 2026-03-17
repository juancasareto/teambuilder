// ============================================================
// TEAMBUILDER — Project, Session & Plan Types
// Definido por Facundo · Schema mínimo viable v0.1
// ============================================================

import type { PlanTier, TeamAgent } from './agent'

// ── MODO DE INICIO ──────────────────────────────────────────
export type StartMode = 'forge' | 'scout'

// ── DIAGNÓSTICO (SCOUT) ─────────────────────────────────────
export interface DiagnosticAnswer {
  questionId: string
  answer: string | 'unknown'  // 'unknown' = "No lo sé aún"
}

export interface DiagnosticQuestion {
  id: string
  question: string
  options: string[]           // opciones predefinidas
  tags: string[]              // tags que activa cada opción
}

// ── PROYECTO ─────────────────────────────────────────────────
export interface Project {
  id: string
  name: string
  goal: string
  description: string
  startMode: StartMode
  diagnosticAnswers?: DiagnosticAnswer[]
  createdAt: number
  updatedAt: number
}

// ── EQUIPO ───────────────────────────────────────────────────
export interface Team {
  id: string
  name: string               // nombre generado automáticamente
  projectId: string
  agents: TeamAgent[]
  createdAt: number
}

// ── MENSAJE DE CHAT ──────────────────────────────────────────
export type MessageSender = string  // agentId o 'user'

export interface ChatMessage {
  id: string
  sender: MessageSender
  content: string
  timestamp: number
  likes: number
  dislikes: number
  isRaisingHand?: boolean    // el agente levantó la mano
  isRead?: boolean
}

// ── SESIÓN ───────────────────────────────────────────────────
export interface Session {
  id: string
  projectId: string
  messages: ChatMessage[]
  activeAgentIds: string[]
  startedAt: number
  endedAt?: number
  messageCount: number
}

// ── MEMORIA (localStorage) ───────────────────────────────────
export interface SessionMemory {
  project: Project
  team: Team
  sessions: Session[]        // últimas 3 (free) | ilimitadas (pro)
  decisions: string[]        // decisiones clave registradas
  lastUpdated: number
}

// ── PLAN ─────────────────────────────────────────────────────
export interface Plan {
  tier: PlanTier
  name: string
  maxAgents: number
  maxSessionsPerWindow: number
  windowMinutes: number
  maxMessagesPerSession: number
  maxSavedSessions: number
  model: string
  features: string[]
  price: number              // 0 = gratis · número = créditos simulados
}

// ── ESTADO DE USO (rate limiting) ────────────────────────────
export interface UsageWindow {
  sessionsUsed: number
  windowStartedAt: number
  resetsAt: number
}
