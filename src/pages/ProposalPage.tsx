// ============================================================
// TEAMBUILDER — ProposalPage
// Santiago · v0.1 — Equipo recomendado
// ============================================================

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent } from '../types/agent'
import type { DiagnosticAnswer } from '../types/project'
import { AgentCard } from '../components/agents/AgentCard'
import { copy } from '../data/copy'

const { headline, subheadline, cta } = copy.proposal
const allAgents = agentsData as Agent[]

// Match simple por tags
function matchAgents(answers: DiagnosticAnswer[]): Array<Agent & { score: number }> {
  const selectedTags = answers
    .filter(a => a.answer !== 'unknown')
    .flatMap(a => {
      const q = copy.diagnostic.questions.find(q => q.id === a.questionId)
      const idx = q?.options.indexOf(a.answer as string) ?? -1
      return idx >= 0 ? [q!.tags[idx]] : []
    })

  return allAgents
    .filter(a => a.status !== 'sleeping')
    .map(agent => {
      const matches = agent.tags.filter(t => selectedTags.includes(t)).length
      const score = Math.min(100, Math.round((matches / Math.max(selectedTags.length, 1)) * 100))
      return { ...agent, score }
    })
    .filter(a => a.score > 0 || a.id === 'rodrigo') // Rodrigo siempre
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

export function ProposalPage() {
  const navigate = useNavigate()
  const rawAnswers = sessionStorage.getItem('scout_answers')
  const answers: DiagnosticAnswer[] = rawAnswers ? JSON.parse(rawAnswers) : []
  const recommended = useMemo(() => matchAgents(answers), [answers])

  const handleAccept = () => {
    sessionStorage.setItem('team_agents', JSON.stringify(recommended.map(a => a.id)))
    navigate('/equipo/chat')
  }

  return (
    <div className="min-h-screen bg-base px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl font-bold text-text-primary mb-3">
            {headline}
          </h1>
          <p className="text-text-muted">{subheadline}</p>
        </div>

        {/* Grid de agentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {recommended.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              variant="proposal"
              matchScore={agent.score}
              onClick={() => navigate(`/catalogo/${agent.id}`)}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleAccept} className="btn-primary">
            {cta.accept}
          </button>
          <button
            onClick={() => navigate('/catalogo')}
            className="btn-ghost"
          >
            {cta.explore}
          </button>
        </div>
      </div>
    </div>
  )
}
