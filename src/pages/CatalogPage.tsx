// ============================================================
// TEAMBUILDER — CatalogPage
// Santiago + Isabella · v0.1
// Catálogo + Banco en un solo flujo
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent, AgentCategory } from '../types/agent'
import { AgentCard } from '../components/agents/AgentCard'
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

export function CatalogPage() {
  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

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

  // Filtrar agentes activos y del banco
  const activeAgents = allAgents.filter(a =>
    a.status === 'active' &&
    (activeFilter === 'all' || a.category === activeFilter)
  )
  const bankAgents = allAgents.filter(a =>
    a.status === 'bank' &&
    (activeFilter === 'all' || a.category === activeFilter)
  )

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
                {headline}
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
                    onClick={() => navigate(`/catalogo/${agent.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Separador: El Banco */}
        {bankAgents.length > 0 && (
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
                    onClick={() => navigate(`/catalogo/${agent.id}`)}
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
            <p className="text-text-muted/60 text-sm mt-1">
              {copy.catalog.emptyState.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
