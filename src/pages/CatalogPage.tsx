// ============================================================
// TEAMBUILDER — CatalogPage
// Santiago + Isabella · v0.1
// Catálogo + Banco · FORGE mode (todos despiertos) vs normal
// ============================================================

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent, AgentCategory } from '../types/agent'
import { AgentCard } from '../components/agents/AgentCard'
import { AgentAvatar } from '../components/agents/AgentAvatar'
import { copy } from '../data/copy'

const allAgents = agentsData as Agent[]
const { headline, filters } = copy.catalog

type FilterKey = 'all' | AgentCategory

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: filters.all },
  { key: 'estrategico', label: filters.estrategico },
  { key: 'tecnico',     label: filters.tecnico },
  { key: 'creativo',    label: filters.creativo },
  { key: 'datos',       label: filters.datos },
  { key: 'social',      label: filters.social },
  { key: 'diseno',      label: filters.diseno },
  { key: 'seguridad',   label: filters.seguridad },
]

const CATEGORY_COLORS: Record<string, string> = {
  estrategico: '#6366F1', tecnico: '#10B981', creativo: '#F59E0B',
  datos: '#8B5CF6', social: '#EC4899', diseno: '#06B6D4', seguridad: '#EF4444',
}

const CATEGORY_LABELS: Record<string, string> = {
  estrategico: 'Estratégico', tecnico: 'Técnico', creativo: 'Creativo',
  datos: 'Datos', social: 'Social', diseno: 'Diseño', seguridad: 'Seguridad',
}

// ── Modal de descripción de agente ────────────────────────────
function AgentModal({ agent, isInTeam, onAdd, onRemove, onClose }: {
  agent: Agent
  isInTeam: boolean
  onAdd: (a: Agent) => void
  onRemove: (a: Agent) => void
  onClose: () => void
}) {
  const accentColor = CATEGORY_COLORS[agent.category] ?? '#10B981'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 animate-fade-up"
        style={{ borderColor: `${accentColor}30` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <AgentAvatar agent={agent} size="lg" showDot={false} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-bold text-lg">{agent.name}</span>
              <span
                className="text-2xs px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                {CATEGORY_LABELS[agent.category]}
              </span>
            </div>
            <p className="text-text-muted text-sm">{agent.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none shrink-0"
          >
            ×
          </button>
        </div>

        {/* Descripción */}
        <p className="text-text-muted text-sm leading-relaxed">{agent.description}</p>

        {/* Voice samples */}
        <div className="flex flex-col gap-1.5">
          {agent.voiceSample.slice(0, 3).map((phrase, i) => (
            <span
              key={i}
              className="text-xs text-text-muted border border-border/40 rounded-lg px-3 py-1.5 italic"
            >
              "{phrase}"
            </span>
          ))}
        </div>

        {/* Skills */}
        {agent.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {agent.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-xs font-mono px-2 py-1 rounded-lg bg-base border border-border text-accent"
              >
                {skill}
              </span>
            ))}
            {agent.skills.length > 4 && (
              <span className="text-xs text-text-muted px-2 py-1">
                +{agent.skills.length - 4} más
              </span>
            )}
          </div>
        )}

        {/* Acción */}
        {isInTeam ? (
          <button
            onClick={() => { onRemove(agent); onClose() }}
            className="btn-ghost w-full text-sm py-2.5"
          >
            Quitar del equipo
          </button>
        ) : (
          <button
            onClick={() => { onAdd(agent); onClose() }}
            className="btn-primary w-full text-sm py-2.5"
          >
            + Agregar al equipo
          </button>
        )}
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export function CatalogPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isForge = searchParams.get('mode') === 'forge'

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const [teamIds, setTeamIds] = useState<string[]>(() => {
    const raw = sessionStorage.getItem('team_agents')
    return raw ? JSON.parse(raw) : ['rodrigo']
  })

  const addToTeam = (agent: Agent) => {
    const next = [...teamIds, agent.id]
    setTeamIds(next)
    sessionStorage.setItem('team_agents', JSON.stringify(next))
  }

  const removeFromTeam = (agent: Agent) => {
    const next = teamIds.filter(id => id !== agent.id)
    setTeamIds(next)
    sessionStorage.setItem('team_agents', JSON.stringify(next))
  }

  // En FORGE: todos los agentes aparecen despiertos
  const filtered = allAgents.filter(a =>
    activeFilter === 'all' || a.category === activeFilter
  )

  const activeAgents = isForge
    ? filtered
    : filtered.filter(a => a.status === 'active')

  const bankAgents = isForge
    ? []
    : filtered.filter(a => a.status === 'bank')

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base/90 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-text-muted text-sm hover:text-text-primary transition-colors mb-1"
              >
                ← Inicio
              </button>
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {isForge ? 'Elegí tu equipo' : headline}
              </h1>
              {isForge && (
                <p className="text-text-muted text-sm mt-0.5">
                  Todos los agentes están disponibles. Clickeá para ver el perfil.
                </p>
              )}
            </div>
            {teamIds.length > 0 && (
              <button
                onClick={() => navigate('/equipo')}
                className="btn-primary text-sm py-2"
              >
                Mi equipo ({teamIds.length}) →
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`
                  whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                  ${activeFilter === f.key
                    ? 'bg-accent text-base font-medium'
                    : 'border border-border text-text-muted hover:border-accent/30 hover:text-text-primary'}
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Agentes activos */}
        {activeAgents.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeAgents.map((agent, i) => (
                <div key={agent.id} className="relative" style={{ animationDelay: `${i * 50}ms` }}>
                  <AgentCard
                    agent={agent}
                    isInTeam={teamIds.includes(agent.id)}
                    onAdd={addToTeam}
                    onRemove={removeFromTeam}
                    onClick={() => setSelectedAgent(agent)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Banco (solo en modo normal) */}
        {bankAgents.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <div className="text-center">
                <p className="text-text-muted font-medium text-sm">{copy.catalog.bankSection}</p>
                <p className="text-text-muted/60 text-xs mt-0.5">{copy.catalog.bankDescription}</p>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bankAgents.map((agent, i) => (
                <div key={agent.id} className="relative" style={{ animationDelay: `${i * 50}ms` }}>
                  <AgentCard
                    agent={agent}
                    isSleeping
                    isInTeam={teamIds.includes(agent.id)}
                    onAdd={addToTeam}
                    onClick={() => setSelectedAgent(agent)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Estado vacío */}
        {activeAgents.length === 0 && bankAgents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted">{copy.catalog.emptyState.title}</p>
            <p className="text-text-muted/60 text-sm mt-1">{copy.catalog.emptyState.description}</p>
          </div>
        )}
      </div>

      {/* Modal de descripción */}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          isInTeam={teamIds.includes(selectedAgent.id)}
          onAdd={addToTeam}
          onRemove={removeFromTeam}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  )
}
