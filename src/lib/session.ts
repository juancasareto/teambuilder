// ============================================================
// TEAMBUILDER — Session & Plan Management
// Matías · v0.1
// Rate limiting: 3 sesiones cada 30 minutos (free)
// ============================================================

import type { Plan, UsageWindow } from '../types/project'
import plansData from '../data/plans.json'

const STORAGE_KEY = 'tb_usage_window'
const MEMORY_KEY  = 'tb_memory'

// ── PLANES ───────────────────────────────────────────────────
export const plans: Plan[] = plansData as Plan[]

export function getPlan(tier: string): Plan {
  return plans.find(p => p.tier === tier) ?? plans[0]
}

// ── VENTANA DE USO ────────────────────────────────────────────
export function getUsageWindow(): UsageWindow {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createNewWindow()
    const window: UsageWindow = JSON.parse(raw)

    // Si la ventana expiró, crear una nueva
    if (Date.now() >= window.resetsAt) return createNewWindow()
    return window
  } catch {
    return createNewWindow()
  }
}

function createNewWindow(): UsageWindow {
  const window: UsageWindow = {
    sessionsUsed: 0,
    windowStartedAt: Date.now(),
    resetsAt: Date.now() + 30 * 60 * 1000,
  }
  saveWindow(window)
  return window
}

function saveWindow(window: UsageWindow): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window))
}

// ── VERIFICAR SI PUEDE ABRIR SESIÓN ───────────────────────────
export function canStartSession(tier: string): {
  allowed: boolean
  reason?: string
  minutesLeft?: number
} {
  const plan = getPlan(tier)

  // PRO y Enterprise — ilimitado
  if (plan.maxSessionsPerWindow === -1) return { allowed: true }

  const window = getUsageWindow()

  if (window.sessionsUsed >= plan.maxSessionsPerWindow) {
    const minutesLeft = Math.ceil((window.resetsAt - Date.now()) / 60000)
    return {
      allowed: false,
      reason: 'session_limit',
      minutesLeft,
    }
  }

  return { allowed: true }
}

// ── REGISTRAR INICIO DE SESIÓN ────────────────────────────────
export function recordSessionStart(): void {
  const window = getUsageWindow()
  window.sessionsUsed += 1
  saveWindow(window)
}

// ── VERIFICAR LÍMITE DE MENSAJES ──────────────────────────────
export function checkMessageLimit(
  currentCount: number,
  tier: string
): { allowed: boolean; warning?: string; minutesLeft?: number } {
  const plan = getPlan(tier)
  if (plan.maxMessagesPerSession === -1) return { allowed: true }

  if (currentCount >= plan.maxMessagesPerSession) {
    return { allowed: false }
  }

  const remaining = plan.maxMessagesPerSession - currentCount
  if (remaining <= 3) {
    return {
      allowed: true,
      warning: `Te quedan ${remaining} mensaje${remaining === 1 ? '' : 's'} en esta sesión.`,
    }
  }

  return { allowed: true }
}

// ── VERIFICAR LÍMITE DE AGENTES ───────────────────────────────
export function checkAgentLimit(
  currentCount: number,
  tier: string
): { allowed: boolean; max: number } {
  const plan = getPlan(tier)
  return {
    allowed: currentCount < plan.maxAgents,
    max: plan.maxAgents,
  }
}

// ── TIEMPO RESTANTE PARA RESET ────────────────────────────────
export function getResetCountdown(): string {
  const window = getUsageWindow()
  const ms = Math.max(0, window.resetsAt - Date.now())
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// ── MEMORIA DE SESIÓN (localStorage) ─────────────────────────
export function loadMemory<T>(): T | null {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveMemory<T>(data: T): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(data))
  } catch {
    // localStorage lleno
    console.warn('TeamBuilder: no se pudo guardar la memoria')
  }
}

export function clearMemory(): void {
  localStorage.removeItem(MEMORY_KEY)
}
