// ============================================================
// TEAMBUILDER — Sidebar (Panel izquierdo del Deck)
// Santiago · v0.1
// Lista de agentes con estado + controles de reunión
// ============================================================

import { useState } from 'react'
import type { Agent } from '../../types/agent'
import type { AgentState } from '../../hooks/useChat'
import { AgentAvatar } from '../agents/AgentAvatar'

interface Props {
  agents: Agent[]
  agentStates: Record<string, AgentState>
  projectName?: string
  teamName?: string
  mode: 'normal' | 'meeting'
  excludeRodrigo: boolean
  onToggleMeeting: () => void
  onToggleRodrigo: () => void
  onAgentClick: (agent: Agent) => void
  onReadOpinion: (agentId: string) => void
  onNavigate: (path: string) => void
}

const STATUS_COLORS = {
  listening: 'bg-agent-listening',
  raising:   'bg-agent-raising animate-ping-once',
  speaking:  'bg-agent-speaking',
}

export function Sidebar({
  agents,
  agentStates,
  projectName,
  teamName,
  mode,
  excludeRodrigo,
  onToggleMeeting,
  onToggleRodrigo,
  onAgentClick,
  onReadOpinion,
  onNavigate,
}: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        flex flex-col h-screen bg-surface border-r border-border
        transition-all duration-300 shrink-0
        ${collapsed ? 'w-16' : 'w-sidebar'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-text-primary font-display font-bold text-sm truncate">
              {teamName ?? 'Mi Equipo'}
            </p>
            {projectName && (
              <p className="text-text-muted text-xs truncate">{projectName}</p>
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="text-text-muted hover:text-text-primary transition-colors ml-auto shrink-0"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Lista de agentes */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {agents.map((agent, i) => {
          const state = agentStates[agent.id]
          const status = state?.status ?? 'listening'
          const hasOpinion = status === 'raising' && state?.pendingOpinion

          return (
            <div
              key={agent.id}
              className={`
                flex items-center gap-3 px-2 py-2.5 rounded-xl
                cursor-pointer group transition-all duration-200
                hover:bg-base/60
                animate-fade-up
                stagger-${Math.min(i + 1, 5)}
              `}
              onClick={() => hasOpinion ? onReadOpinion(agent.id) : onAgentClick(agent)}
            >
              <div className="relative shrink-0">
                <AgentAvatar
                  agent={agent}
                  size="sm"
                  status={status}
                  showDot={!collapsed}
                />
                {/* Indicador de mano levantada */}
                {hasOpinion && (
                  <span className="absolute -top-1 -right-1 text-xs animate-bounce">
                    ✋
                  </span>
                )}
              </div>

              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {agent.name}
                    </p>
                    <p className="text-text-muted text-xs truncate">
                      {status === 'raising' ? 'tiene algo para decir' :
                       status === 'speaking' ? 'hablando...' : agent.role}
                    </p>
                  </div>

                  {/* Dot de estado */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status]}`}
                  />
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Controles */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-border space-y-2">
          {/* Botón reunión */}
          <button
            onClick={onToggleMeeting}
            className={`
              w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200
              ${mode === 'meeting'
                ? 'bg-accent text-base'
                : 'bg-base border border-border text-text-muted hover:border-accent/30 hover:text-text-primary'}
            `}
          >
            <span>{mode === 'meeting' ? '⚡' : '⚡'}</span>
            <span>{mode === 'meeting' ? 'Reunión activa' : 'Convocar reunión'}</span>
          </button>

          {/* Toggle Rodrigo */}
          <button
            onClick={onToggleRodrigo}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <span>{excludeRodrigo ? '👁' : '🗂️'}</span>
            <span>{excludeRodrigo ? 'Incluir a Rodrigo' : 'Excluir a Rodrigo'}</span>
          </button>

          {/* Navegación */}
          <div className="flex gap-1 pt-1">
            <button
              onClick={() => onNavigate('/equipo')}
              className="flex-1 text-xs text-text-muted hover:text-text-primary transition-colors py-1"
            >
              Mi equipo
            </button>
            <button
              onClick={() => onNavigate('/planes')}
              className="flex-1 text-xs text-text-muted hover:text-accent transition-colors py-1"
            >
              Planes ✨
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
