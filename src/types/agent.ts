// ============================================================
// TEAMBUILDER — Agent Types
// Definido por Facundo · Schema mínimo viable v0.1
// ============================================================

export type AgentCategory =
  | 'estrategico'
  | 'tecnico'
  | 'creativo'
  | 'datos'
  | 'social'
  | 'diseno'
  | 'seguridad'

export type AgentStatus = 'active' | 'bank' | 'sleeping'

export type PlanTier = 'free' | 'pro' | 'enterprise'

export interface VoiceConfig {
  pitch: number   // 0.5 - 2.0
  rate: number    // 0.5 - 2.0
  lang: string    // 'es-AR'
}

export interface Agent {
  id: string
  name: string
  role: string
  category: AgentCategory
  color: string           // hex color de acento
  status: AgentStatus
  avatar: string          // seed para DiceBear
  emoji: string
  personality: string     // descripción corta de voz y forma de pensar
  description: string     // descripción pública del agente
  voiceSample: string[]   // frases características (2-3)
  tags: string[]          // para el match de SCOUT
  skills: string[]        // comandos npx skillsadd
  systemPrompt: string    // prompt optimizado ~300 tokens
  voiceConfig: VoiceConfig
  invokeWith: string[]    // cómo invocarlo
  examples: string[]      // ejemplos de uso (2-3)
}

export interface TeamAgent extends Agent {
  addedAt: number         // timestamp
  likedMessages: string[] // ids de mensajes likeados
}
