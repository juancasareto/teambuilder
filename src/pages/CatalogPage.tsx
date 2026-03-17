// ============================================================
// TEAMBUILDER — CatalogPage
// Santiago + Isabella · v0.1
// Catálogo + Banco en un solo flujo
// Soporta FORGE mode (todos los agentes despiertos)
// ============================================================

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  estrategico: '#6366F1',
  tecnico:     '#10B981',
  creativo:    '#F59E0B',
  datos:       '#8B5CF6',
  social:      '#EC4899',
  diseno:      '#06B6D4',
  seguridad:   '#EF4444',
}

export function CatalogPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // FORGE mode: viene de WelcomePage con state.mode = 'forge'
  const isForge = (location.state as { mode?: string } | null)?.mode === 'forge'

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Agentes en equipo (desde sessionStorage en v0.1)
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
  const visibleAgents = isForge
    ? allAgents.filter(a => activeFilter === 'all' || a.category === activeFilter)
    : allAgents.filter(a => a.status === 'active' && (activeFilter === 'all' || a.category === activeFilter))

  const bankAgents = isForge
    ? []
    : allAgents.filter(a => a.status === 'bank' && (activeFilter === 'all' || a.category === activeFilter))

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
              <h1 className="font-ui text-2xl font-bold text-text-primary">
                {isForge ? '⚡ FORGE — Elegí tu equipo' : headline}
              </h1>
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
        {/* Agentes */}
        {visibleAgents.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleAgents.map((agent, i) => (
                <div key={agent.id} className="relative" style={{ animationDelay: `${i * 50}ms` }}>
                  <AgentCard
                    agent={agent}
                    isInTeam={teamIds.includes(agent.id)}
                    onAdd={addToTeam}
                    onRemove={removeFromTeam}
                    onClick={setSelectedAgent}
                    showAddButton={isForge ? 'top-right' : 'footer'}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Separador: El Banco (solo en modo catálogo normal) */}
        {!isForge && bankAgents.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <div className="text-center">
                <p className="text-text-muted font-medium text-sm">
                  {copy.catalog.bankSection}
                </p>
                <p className="text-text-muted/60 text-xs mt-0.5">
                  {copy.catalog.bankDescription}
                </p>
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
                    onClick={setSelectedAgent}
                    showAddButton="footer"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Estado vacío */}
        {visibleAgents.length === 0 && bankAgents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted">{copy.catalog.emptyState.title}</p>
            <p className="text-text-muted/60 text-sm mt-1">
              {copy.catalog.emptyState.description}
            </p>
          </div>
        )}
      </div>

      {/* Modal de descripción de agente */}
      {selectedAgent && (
        <div
          className="fixed inset-0 bg-base/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAgent(null)}
        >
          <div
            className="card max-w-md w-full p-6 flex flex-col gap-5 animate-fade-up"
            style={{ borderColor: `${CATEGORY_COLORS[selectedAgent.category]}30` }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AgentAvatar agent={selectedAgent} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-ui text-xl font-bold text-text-primary">
                      {selectedAgent.name}
                    </h2>
                    <span
                      className="text-2xs font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[selectedAgent.category]}15`,
                        color: CATEGORY_COLORS[selectedAgent.category],
                      }}
                    >
                      {selectedAgent.category}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">{selectedAgent.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none ml-2"
              >
                ×
              </button>
            </div>

            {/* Descripción */}
            <p className="text-text-muted text-sm leading-relaxed">
              {selectedAgent.description}
            </p>

            {/* Voz del agente */}
            <div className="flex flex-col gap-1.5">
              {selectedAgent.voiceSample.map((phrase, i) => (
                <span
                  key={i}
                  className="text-xs text-text-muted border border-border/50 rounded-lg px-3 py-2 italic"
                >
                  "{phrase}"
                </span>
              ))}
            </div>

            {/* Skills count */}
            <p className="text-text-muted/60 text-xs">
              {selectedAgent.skills.length} skills disponibles · se invocan con{' '}
              <code className="text-accent font-mono">
                {selectedAgent.invokeWith[0]}
              </code>
            </p>

            {/* Acciones */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setSelectedAgent(null)}
                className="btn-ghost flex-1 text-sm py-2.5"
              >
                Cerrar
              </button>
              {teamIds.includes(selectedAgent.id) ? (
                <button
                  onClick={() => { removeFromTeam(selectedAgent); setSelectedAgent(null) }}
                  className="flex-1 text-sm py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors"
                >
                  Quitar del equipo
                </button>
              ) : (
                <button
                  onClick={() => { addToTeam(selectedAgent); setSelectedAgent(null) }}
                  className="btn-primary flex-1 text-sm py-2.5"
                  style={{ backgroundColor: CATEGORY_COLORS[selectedAgent.category] }}
                >
                  + Agregar al equipo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
