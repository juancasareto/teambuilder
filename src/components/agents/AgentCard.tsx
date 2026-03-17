// ============================================================
// TEAMBUILDER — AgentCard
// Santiago · v0.1
// Card de agente para Catálogo, Propuesta y Mi Equipo
// ============================================================

import { useState } from 'react'
import type { Agent } from '../../types/agent'
import { AgentAvatar } from './AgentAvatar'

interface Props {
  agent: Agent
  variant?: 'catalog' | 'team' | 'compact' | 'proposal'
  isInTeam?: boolean
  matchScore?: number          // 0-100, solo en variant=proposal
  onAdd?: (agent: Agent) => void
  onRemove?: (agent: Agent) => void
  onClick?: (agent: Agent) => void
  isSleeping?: boolean         // agentes del banco
}

// Color de acento por categoría
const CATEGORY_COLORS: Record<string, string> = {
  estrategico: '#6366F1',
  tecnico:     '#10B981',
  creativo:    '#F59E0B',
  datos:       '#8B5CF6',
  social:      '#EC4899',
  diseno:      '#06B6D4',
  seguridad:   '#EF4444',
}

const CATEGORY_LABELS: Record<string, string> = {
  estrategico: 'Estratégico',
  tecnico:     'Técnico',
  creativo:    'Creativo',
  datos:       'Datos',
  social:      'Social',
  diseno:      'Diseño',
  seguridad:   'Seguridad',
}

export function AgentCard({
  agent,
  variant = 'catalog',
  isInTeam = false,
  matchScore,
  onAdd,
  onRemove,
  onClick,
  isSleeping = false,
}: Props) {
  const [activating, setActivating] = useState(false)
  const [justification, setJustification] = useState('')
  const accentColor = CATEGORY_COLORS[agent.category] ?? '#10B981'

  // ── Variante COMPACT (sidebar del deck) ─────────────────
  if (variant === 'compact') {
    return (
      <button
        onClick={() => onClick?.(agent)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5
          rounded-xl transition-all duration-200
          hover:bg-surface/80 group
          ${isSleeping ? 'opacity-40' : ''}
        `}
      >
        <AgentAvatar agent={agent} size="sm" />
        <div className="flex-1 text-left min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">{agent.name}</p>
          <p className="text-text-muted text-xs truncate">{agent.role}</p>
        </div>
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      </button>
    )
  }

  // ── Variante TEAM (Mi Equipo) ────────────────────────────
  if (variant === 'team') {
    return (
      <div
        className="card p-4 flex items-center gap-4 cursor-pointer group"
        style={{ borderColor: `${accentColor}20` }}
        onClick={() => onClick?.(agent)}
      >
        <AgentAvatar agent={agent} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-semibold">{agent.name}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {CATEGORY_LABELS[agent.category]}
            </span>
          </div>
          <p className="text-text-muted text-sm truncate">{agent.role}</p>
        </div>
        {onRemove && (
          <button
            onClick={e => { e.stopPropagation(); onRemove(agent) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-primary text-xl leading-none"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  // ── Variante PROPOSAL (match score) ─────────────────────
  if (variant === 'proposal') {
    return (
      <div
        className="card card-hover p-5 flex flex-col gap-4 animate-fade-up"
        onClick={() => onClick?.(agent)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AgentAvatar agent={agent} size="md" />
            <div>
              <p className="text-text-primary font-semibold">{agent.name}</p>
              <p className="text-text-muted text-sm">{agent.role}</p>
            </div>
          </div>
          {matchScore !== undefined && (
            <span
              className="text-sm font-mono font-bold px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {matchScore}%
            </span>
          )}
        </div>
        <p className="text-text-muted text-sm line-clamp-2">{agent.description}</p>
        {onAdd && !isInTeam && (
          <button
            onClick={e => { e.stopPropagation(); onAdd(agent) }}
            className="btn-primary w-full text-sm py-2"
          >
            Agregar al equipo
          </button>
        )}
        {isInTeam && (
          <span className="text-center text-sm text-accent font-medium">✓ En el equipo</span>
        )}
      </div>
    )
  }

  // ── Variante CATALOG (default) ───────────────────────────
  return (
    <div
      className={`
        card p-5 flex flex-col gap-4 cursor-pointer
        transition-all duration-300 group
        ${isSleeping
          ? 'opacity-50 saturate-0 hover:opacity-70 hover:saturate-50'
          : 'card-hover animate-fade-up'}
      `}
      style={!isSleeping ? { '--tw-shadow-color': `${accentColor}20` } as React.CSSProperties : {}}
      onClick={() => isSleeping ? setActivating(true) : onClick?.(agent)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AgentAvatar agent={agent} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-semibold">{agent.name}</span>
              {isSleeping && (
                <span className="text-2xs text-text-muted border border-border rounded px-1.5 py-0.5">
                  Durmiendo
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm">{agent.role}</p>
          </div>
        </div>
        <span
          className="text-2xs font-medium uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          {CATEGORY_LABELS[agent.category]}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-text-muted text-sm line-clamp-2">{agent.description}</p>

      {/* Voice samples */}
      <div className="flex flex-wrap gap-1.5">
        {agent.voiceSample.slice(0, 2).map((phrase, i) => (
          <span
            key={i}
            className="text-xs text-text-muted border border-border/50 rounded-lg px-2 py-1 italic"
          >
            "{phrase}"
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <span className="text-text-muted text-xs">
          {agent.skills.length} skills
        </span>
        {!isSleeping && (
          isInTeam ? (
            <button
              onClick={e => { e.stopPropagation(); onRemove?.(agent) }}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Quitar del equipo
            </button>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onAdd?.(agent) }}
              className="text-xs font-medium transition-colors"
              style={{ color: accentColor }}
            >
              + Agregar
            </button>
          )
        )}
        {isSleeping && (
          <button
            onClick={e => { e.stopPropagation(); setActivating(true) }}
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            Despertar →
          </button>
        )}
      </div>

      {/* Modal de activación (banco) */}
      {activating && isSleeping && (
        <div
          className="absolute inset-0 bg-surface/95 backdrop-blur-sm rounded-2xl p-5 flex flex-col gap-4 z-10"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-text-primary font-semibold text-sm">
            ¿Por qué necesitás a {agent.name}?
          </p>
          <textarea
            autoFocus
            value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Una línea es suficiente..."
            className="flex-1 bg-base border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/50"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setActivating(false)}
              className="btn-ghost flex-1 text-sm py-2"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (justification.trim()) {
                  onAdd?.(agent)
                  setActivating(false)
                }
              }}
              disabled={!justification.trim()}
              className="btn-primary flex-1 text-sm py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Despertar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
