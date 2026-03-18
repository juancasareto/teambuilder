// TEAMBUILDER — AgentCard · Terminal row

import { useState } from 'react'
import type { Agent } from '../../types/agent'

interface Props {
  agent: Agent
  variant?: 'catalog' | 'team' | 'compact' | 'proposal'
  isInTeam?: boolean
  matchScore?: number
  onAdd?: (agent: Agent) => void
  onRemove?: (agent: Agent) => void
  onClick?: (agent: Agent) => void
  isSleeping?: boolean
}

const CAT_COLOR: Record<string, string> = {
  estrategico: '#A855F7',
  tecnico:     '#00FF41',
  creativo:    '#FFB000',
  datos:       '#C084FC',
  social:      '#FF6EB4',
  diseno:      '#00E5FF',
  seguridad:   '#FF3B3B',
}

const CAT_TAG: Record<string, string> = {
  estrategico: 'STRAT',
  tecnico:     'TECH',
  creativo:    'CREAT',
  datos:       'DATA',
  social:      'SOC',
  diseno:      'DSGN',
  seguridad:   'SEC',
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
  const color = CAT_COLOR[agent.category] ?? '#00FF41'
  const tag = CAT_TAG[agent.category] ?? '???'

  // ── COMPACT (sidebar) ──────────────────────────────────────
  if (variant === 'compact') {
    return (
      <button
        onClick={() => onClick?.(agent)}
        className="w-full text-left px-2 py-1 transition-colors hover:bg-[#0F0F0F] group"
        style={{ opacity: isSleeping ? 0.3 : 1 }}
      >
        <span className="text-dim group-hover:text-green text-xs mr-2">›</span>
        <span className="text-xs text-base">{agent.name}</span>
      </button>
    )
  }

  // ── TEAM ──────────────────────────────────────────────────
  if (variant === 'team') {
    return (
      <div
        className="flex items-center gap-3 py-1.5 border-b border-[#111] cursor-pointer group"
        onClick={() => onClick?.(agent)}
      >
        <span className="text-green text-xs w-4">›</span>
        <span className="text-xs font-bold w-24 truncate" style={{ color }}>{agent.name}</span>
        <span className="text-xs opacity-50 w-12" style={{ color }}>[{tag}]</span>
        <span className="text-muted text-xs flex-1 truncate">{agent.role}</span>
        {onRemove && (
          <button
            onClick={e => { e.stopPropagation(); onRemove(agent) }}
            className="text-dim hover:text-red text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2"
          >
            [×]
          </button>
        )}
      </div>
    )
  }

  // ── PROPOSAL ──────────────────────────────────────────────
  if (variant === 'proposal') {
    return (
      <div className="term-box cursor-pointer mb-2" onClick={() => onClick?.(agent)}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold" style={{ color }}>{agent.name}</span>
          <span className="text-dim text-xs">[{tag}]</span>
          <span className="text-muted text-xs flex-1">{agent.role}</span>
          {matchScore !== undefined && (
            <span className="text-xs font-bold" style={{ color }}>{matchScore}%</span>
          )}
        </div>
        <div className="mt-1.5 text-xs text-muted line-clamp-1">{agent.description}</div>
        {onAdd && !isInTeam && (
          <button
            onClick={e => { e.stopPropagation(); onAdd(agent) }}
            className="mt-2 term-btn term-btn-primary text-xs py-1"
          >
            + agregar
          </button>
        )}
        {isInTeam && <span className="mt-1.5 inline-block text-xs text-green">[✓ en equipo]</span>}
      </div>
    )
  }

  // ── CATALOG — sleeping ─────────────────────────────────────
  if (isSleeping) {
    if (activating) {
      return (
        <div className="py-2 px-0 border-b border-[#1A1A1A]">
          <div className="text-amber text-xs mb-1.5">
            &gt; wake {agent.name} — justify:
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-green text-xs">$</span>
            <input
              autoFocus
              value={justification}
              onChange={e => setJustification(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && justification.trim()) { onAdd?.(agent); setActivating(false) }
                if (e.key === 'Escape') setActivating(false)
              }}
              placeholder="una línea es suficiente..."
              className="term-input text-xs flex-1"
            />
            <button
              onClick={() => { if (justification.trim()) { onAdd?.(agent); setActivating(false) } }}
              disabled={!justification.trim()}
              className="term-btn term-btn-primary text-xs py-0.5 px-2 disabled:opacity-30"
            >
              [↵]
            </button>
            <button onClick={() => setActivating(false)} className="term-btn text-xs py-0.5 px-2">[esc]</button>
          </div>
        </div>
      )
    }

    return (
      <div
        className="flex items-center gap-3 py-1.5 border-b border-[#0F0F0F] cursor-pointer group"
        onClick={() => setActivating(true)}
      >
        <span className="text-xs w-4" style={{ color: '#1E1E1E' }}>○</span>
        <span className="text-xs w-24 truncate" style={{ color: '#222' }}>{agent.name}</span>
        <span className="text-xs w-14" style={{ color: '#1A1A1A' }}>[{tag}]</span>
        <span className="text-xs flex-1 truncate" style={{ color: '#1E1E1E' }}>{agent.role}</span>
        <span className="text-xs text-dim opacity-0 group-hover:opacity-60 transition-opacity">[wake]</span>
      </div>
    )
  }

  // ── CATALOG — active ───────────────────────────────────────
  return (
    <div
      className="flex items-center gap-3 py-1.5 border-b border-[#111] cursor-pointer group hover:bg-[#0A0A0A] transition-colors"
      onClick={() => onClick?.(agent)}
    >
      <span className="text-xs w-4 group-hover:glow-green transition-all" style={{ color }}>●</span>
      <span className="text-xs font-bold w-24 truncate group-hover:text-green transition-colors" style={{ color }}>
        {agent.name}
      </span>
      <span className="text-xs w-14 opacity-50" style={{ color }}>[{tag}]</span>
      <span className="text-muted text-xs w-40 truncate">{agent.role}</span>
      <span className="text-dim text-xs flex-1 truncate hidden md:block italic">
        "{agent.voiceSample[0]?.slice(0, 38)}"
      </span>
      <span className="text-dim text-xs w-14 text-right">{agent.skills.length}sk</span>
      <div className="w-14 text-right shrink-0">
        {isInTeam ? (
          <button
            onClick={e => { e.stopPropagation(); onRemove?.(agent) }}
            className="text-xs text-green hover:text-red transition-colors"
          >
            [✓ out]
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onAdd?.(agent) }}
            className="text-xs text-dim hover:text-green transition-colors opacity-0 group-hover:opacity-100"
          >
            [+add]
          </button>
        )}
      </div>
    </div>
  )
}
