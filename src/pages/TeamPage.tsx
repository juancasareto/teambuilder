// ============================================================
// TEAMBUILDER — TeamPage · Mi Equipo
// Santiago · v0.1
// ============================================================

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent } from '../types/agent'
import { AgentCard } from '../components/agents/AgentCard'
import { copy } from '../data/copy'

const allAgents = agentsData as Agent[]

function generateTeamName(agentIds: string[]): string {
  const combos: Record<string, string> = {
    'rodrigo-facundo-matias-santiago': 'El Cuarteto Técnico',
    'bautista-ramiro': 'Caos Creativo',
    'lucia-isabella': 'Las Arquitectas',
    'tomas-gonzalo': 'Los Conectores',
  }
  // key reserved for future use
  for (const [pattern, name] of Object.entries(combos)) {
    if (pattern.split('-').every(id => agentIds.includes(id))) return name
  }
  if (agentIds.length >= 8) return 'El Equipo Completo'
  if (agentIds.length >= 5) return 'El Equipo Expandido'
  if (agentIds.length >= 3) return 'El Núcleo'
  return copy.teamNames.fallback
}

export function TeamPage() {
  const navigate = useNavigate()

  const teamIds: string[] = useMemo(() => {
    const raw = sessionStorage.getItem('team_agents')
    return raw ? JSON.parse(raw) : []
  }, [])

  const teamAgents = useMemo(() =>
    teamIds
      .map(id => allAgents.find(a => a.id === id))
      .filter((a): a is Agent => !!a)
  , [teamIds])

  const teamName = useMemo(() => generateTeamName(teamIds), [teamIds])

  const removeFromTeam = (agent: Agent) => {
    const next = teamIds.filter(id => id !== agent.id)
    sessionStorage.setItem('team_agents', JSON.stringify(next))
    window.location.reload()
  }

  // Estado vacío
  if (teamAgents.length === 0) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="text-text-primary font-display text-3xl font-bold">
          {copy.myTeam.emptyState.title}
        </p>
        <p className="text-text-muted">{copy.myTeam.emptyState.description}</p>
        <button onClick={() => navigate('/catalogo')} className="btn-primary">
          {copy.myTeam.emptyState.cta}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-text-muted text-sm mb-2 uppercase tracking-wider font-mono">
            Tu equipo
          </p>
          <h1 className="font-display text-4xl font-bold text-gradient mb-4">
            {teamName}
          </h1>
          <p className="text-text-muted">
            {teamAgents.length} agente{teamAgents.length !== 1 ? 's' : ''} listos para arrancar.
          </p>
        </div>

        {/* Agentes */}
        <div className="space-y-3 mb-10">
          {teamAgents.map((agent, i) => (
            <div key={agent.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <AgentCard
                agent={agent}
                variant="team"
                isInTeam
                onRemove={agent.id !== 'rodrigo' ? removeFromTeam : undefined}
                onClick={() => navigate(`/catalogo/${agent.id}`)}
              />
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/equipo/chat')}
            className="btn-primary"
          >
            {copy.myTeam.startCta}
          </button>
          <button
            onClick={() => navigate('/catalogo')}
            className="btn-ghost"
          >
            {copy.myTeam.editCta}
          </button>
        </div>
      </div>
    </div>
  )
}
