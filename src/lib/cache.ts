// ============================================================
// TEAMBUILDER — Cache de respuestas en localStorage
// Matías + Gonzalo · v0.1
// ============================================================

const CACHE_PREFIX = 'tb_cache_'
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 minutos

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export const cache = {
  // Construir key de caché basado en agente + últimos 3 mensajes
  buildKey(agentId: string, messages: Array<{ content: string }>): string {
    const recent = messages.slice(-3).map(m => m.content).join('|')
    const hash = btoa(encodeURIComponent(`${agentId}:${recent}`)).slice(0, 40)
    return `${CACHE_PREFIX}${hash}`
  },

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null

      const entry: CacheEntry<T> = JSON.parse(raw)
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(key)
        return null
      }

      return entry.value
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T, ttlMs = CACHE_TTL_MS): void {
    try {
      const entry: CacheEntry<T> = {
        value,
        expiresAt: Date.now() + ttlMs,
      }
      localStorage.setItem(key, JSON.stringify(entry))
    } catch {
      // localStorage lleno — limpiar entradas expiradas
      cache.cleanup()
    }
  },

  // Limpiar entradas expiradas
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX))
      keys.forEach(key => {
        const raw = localStorage.getItem(key)
        if (!raw) return
        try {
          const entry: CacheEntry<unknown> = JSON.parse(raw)
          if (Date.now() > entry.expiresAt) localStorage.removeItem(key)
        } catch {
          localStorage.removeItem(key)
        }
      })
    } catch {
      // Silencioso
    }
  },

  // Limpiar todo el caché de la app
  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX))
    keys.forEach(key => localStorage.removeItem(key))
  },
}
