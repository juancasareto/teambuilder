// ============================================================
// TEAMBUILDER — AgentAvatar
// Santiago · v0.1
// DiceBear avatars + estado visual (listening/raising/speaking)
// ============================================================

import { useMemo } from 'react'
import type { Agent } from '../../types/agent'

interface Props {
  agent: Agent
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'listening' | 'raising' | 'speaking'
  showDot?: boolean
  className?: string
}

const SIZES = {
  sm: { container: 'w-8 h-8',  dot: 'w-2 h-2 -bottom-0.5 -right-0.5', text: 'text-sm' },
  md: { container: 'w-10 h-10', dot: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5', text: 'text-base' },
  lg: { container: 'w-14 h-14', dot: 'w-3 h-3 bottom-0 right-0', text: 'text-2xl' },
  xl: { container: 'w-20 h-20', dot: 'w-3.5 h-3.5 bottom-0 right-0', text: 'text-3xl' },
}

const STATUS_COLORS = {
  listening: 'bg-agent-listening',
  raising:   'bg-agent-raising',
  speaking:  'bg-agent-speaking',
}

// Generar URL de avatar DiceBear basado en el seed del agente
function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0A0A0F&size=80`
}

// Color de borde según categoría del agente
function getBorderColor(agent: Agent): string {
  const colors: Record<string, string> = {
    estrategico: 'border-category-estrategico/40',
    tecnico:     'border-category-tecnico/40',
    creativo:    'border-category-creativo/40',
    datos:       'border-category-datos/40',
    social:      'border-category-social/40',
    diseno:      'border-category-diseno/40',
    seguridad:   'border-category-seguridad/40',
  }
  return colors[agent.category] ?? 'border-border'
}

// Glow según status
function getGlow(status?: Props['status']): string {
  if (status === 'speaking') return 'shadow-[0_0_12px_rgba(248,248,255,0.2)]'
  if (status === 'raising')  return 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  return ''
}

export function AgentAvatar({ agent, size = 'md', status, showDot = true, className = '' }: Props) {
  const s = SIZES[size]
  const avatarUrl = useMemo(() => getAvatarUrl(agent.avatar), [agent.avatar])

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Avatar container */}
      <div
        className={`
          ${s.container}
          rounded-xl border-2 ${getBorderColor(agent)}
          overflow-hidden bg-surface
          transition-all duration-300
          ${getGlow(status)}
          ${status === 'raising' ? 'scale-105' : ''}
        `}
        style={{ borderColor: status === 'speaking' ? agent.color : undefined }}
      >
        {/* Intentar cargar imagen DiceBear, fallback a emoji */}
        <img
          src={avatarUrl}
          alt={agent.name}
          className="w-full h-full object-cover"
          onError={e => {
            // Fallback: mostrar emoji centrado
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.emoji-fallback')) {
              const span = document.createElement('span')
              span.className = `emoji-fallback flex items-center justify-center w-full h-full ${s.text}`
              span.textContent = agent.emoji
              parent.appendChild(span)
            }
          }}
        />
      </div>

      {/* Dot de estado */}
      {showDot && status && (
        <span
          className={`
            absolute ${s.dot}
            rounded-full border-2 border-base
            ${STATUS_COLORS[status]}
            ${status === 'raising' ? 'animate-ping-once' : ''}
            transition-colors duration-300
          `}
        />
      )}
    </div>
  )
}

// ── Variante solo emoji (sin imagen) ────────────────────────
export function AgentEmoji({
  agent,
  size = 'md',
}: Pick<Props, 'agent' | 'size'>) {
  const s = SIZES[size]
  return (
    <div
      className={`
        ${s.container} ${s.text}
        rounded-xl border-2 border-border
        flex items-center justify-center
        bg-surface
      `}
    >
      {agent.emoji}
    </div>
  )
}
