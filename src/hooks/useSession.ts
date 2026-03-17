// ============================================================
// TEAMBUILDER — useSession hook
// Matías · v0.1
// Gestiona plan, límites y ventana de tiempo
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import {
  canStartSession,
  checkAgentLimit,
  checkMessageLimit,
  getResetCountdown,
  getPlan,
  recordSessionStart,
} from '../lib/session'
import type { Plan } from '../types/project'

export interface SessionState {
  tier: string
  plan: Plan
  canStart: boolean
  limitReason?: string
  minutesLeft?: number
  countdown: string
  messageCount: number
}

export function useSession(tier = 'free') {
  const [state, setState] = useState<SessionState>(() => {
    const check = canStartSession(tier)
    return {
      tier,
      plan: getPlan(tier),
      canStart: check.allowed,
      limitReason: check.reason,
      minutesLeft: check.minutesLeft,
      countdown: getResetCountdown(),
      messageCount: 0,
    }
  })

  // Actualizar countdown cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const check = canStartSession(tier)
      setState(prev => ({
        ...prev,
        canStart: check.allowed,
        minutesLeft: check.minutesLeft,
        countdown: getResetCountdown(),
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [tier])

  const startSession = useCallback(() => {
    const check = canStartSession(tier)
    if (!check.allowed) return false
    recordSessionStart()
    setState(prev => ({ ...prev, canStart: true }))
    return true
  }, [tier])

  const incrementMessage = useCallback(() => {
    setState(prev => ({ ...prev, messageCount: prev.messageCount + 1 }))
  }, [])

  const checkMessage = useCallback(() => {
    return checkMessageLimit(state.messageCount, tier)
  }, [state.messageCount, tier])

  const checkAgent = useCallback((currentCount: number) => {
    return checkAgentLimit(currentCount, tier)
  }, [tier])

  return { ...state, startSession, incrementMessage, checkMessage, checkAgent }
}
