// TEAMBUILDER — CatalogPage · Terminal listing

import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent, AgentCategory } from '../types/agent'
import { AgentCard } from '../components/agents/AgentCard'

const allAgents = agentsData as Agent[]

const MAX_TEAM = 8

const FILTERS: { key: 'all' | AgentCategory; label: string; tag: string }[] = [
  { key: 'all',         label: 'todos',      tag: 'ALL'   },
  { key: 'estrategico', label: 'estratégico', tag: 'STRAT' },
  { key: 'tecnico',     label: 'técnico',    tag: 'TECH'  },
  { key: 'creativo',    label: 'creativo',   tag: 'CREAT' },
  { key: 'datos',       label: 'datos',      tag: 'DATA'  },
  { key: 'social',      label: 'social',     tag: 'SOC'   },
  { key: 'diseno',      label: 'diseño',     tag: 'DSGN'  },
  { key: 'seguridad',   label: 'seguridad',  tag: 'SEC'   },
]

export function CatalogPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isForge = params.get('mode') === 'forge'

  const [filter, setFilter] = useState<'all' | AgentCategory>('all')
  const [search, setSearch] = useState('')
  const [teamIds, setTeamIds] = useState<string[]>(() => {
    const raw = sessionStorage.getItem('team_agents')
    return raw ? JSON.parse(raw) : []
  })
  const [modalAgent, setModalAgent] = useState<Agent | null>(null)

  const saveTeam = (ids: string[]) => {
    setTeamIds(ids)
    sessionStorage.setItem('team_agents', JSON.stringify(ids))
  }

  const addAgent = (agent: Agent) => {
    if (teamIds.length >= MAX_TEAM) return
    if (!teamIds.includes(agent.id)) saveTeam([...teamIds, agent.id])
  }

  const removeAgent = (agent: Agent) => {
    saveTeam(teamIds.filter(id => id !== agent.id))
  }

  const filtered = useMemo(() => {
    return allAgents.filter(a => {
      const matchCat = filter === 'all' || a.category === filter
      const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [filter, search])

  const active = filtered.filter(a => isForge || a.status === 'active')
  const sleeping = filtered.filter(a => !isForge && a.status !== 'active')

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-dim text-xs hover:text-green transition-colors">
              ← /home
            </button>
            <span className="text-dim text-xs">/</span>
            <span className="text-green text-xs">catalogo</span>
            {isForge && <span className="text-amber text-xs">[FORGE]</span>}
          </div>

          {/* Team counter */}
          {teamIds.length > 0 && (
            <button
              onClick={() => navigate('/equipo')}
              className="term-btn term-btn-primary text-xs py-1"
            >
              mi equipo [{teamIds.length}/{MAX_TEAM}] →
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1 mb-1 flex-wrap">
          <span className="text-dim text-xs mr-2">--filter</span>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="text-xs px-2 py-0.5 transition-colors"
              style={{
                color: filter === f.key ? '#00FF41' : '#444',
                borderBottom: filter === f.key ? '1px solid #00FF41' : '1px solid transparent',
              }}
            >
              {f.tag}
            </button>
          ))}

          {/* Search */}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-dim text-xs">--grep</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="nombre / rol"
              className="term-input text-xs w-36"
            />
          </div>
        </div>

        <hr className="term-hr mb-4" />

        {/* Column headers */}
        <div className="flex items-center gap-3 py-1 text-dim text-xs border-b border-[#1A1A1A] mb-1">
          <span className="w-4">ST</span>
          <span className="w-24">NAME</span>
          <span className="w-14">CAT</span>
          <span className="w-40">ROLE</span>
          <span className="flex-1 hidden md:block">VOICE</span>
          <span className="w-14 text-right">SKILLS</span>
          <span className="w-14 text-right">ACTION</span>
        </div>

        {/* Active agents */}
        {active.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isInTeam={teamIds.includes(agent.id)}
            onAdd={teamIds.length < MAX_TEAM ? addAgent : undefined}
            onRemove={removeAgent}
            onClick={setModalAgent}
          />
        ))}

        {/* Sleeping agents */}
        {sleeping.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-6 mb-2">
              <span className="text-dim text-xs">── sleeping ({sleeping.length})</span>
            </div>
            {sleeping.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSleeping
                isInTeam={teamIds.includes(agent.id)}
                onAdd={teamIds.length < MAX_TEAM ? addAgent : undefined}
              />
            ))}
          </>
        )}

        {/* Team limit warning */}
        {teamIds.length >= MAX_TEAM && (
          <div className="mt-4 text-amber text-xs">
            [!] equipo completo ({MAX_TEAM}/{MAX_TEAM}) — remové un agente para agregar otro
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-dim text-xs">
          <span>{filtered.length} agentes · {teamIds.length}/{MAX_TEAM} seleccionados</span>
          {teamIds.length > 0 && (
            <button onClick={() => navigate('/equipo')} className="term-btn term-btn-primary text-xs py-1">
              generar prompt →
            </button>
          )}
        </div>
      </div>

      {/* Agent detail modal */}
      {modalAgent && (
        <div
          className="fixed inset-0 bg-[#080808]/90 flex items-center justify-center p-4 z-50"
          onClick={() => setModalAgent(null)}
        >
          <div
            className="term-box max-w-lg w-full"
            style={{ borderColor: '#1E1E1E' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green">{modalAgent.name}</span>
                <span className="text-dim text-xs">{modalAgent.role}</span>
              </div>
              <button onClick={() => setModalAgent(null)} className="text-dim hover:text-base text-xs">[esc]</button>
            </div>

            {/* Description */}
            <p className="text-muted text-xs mb-3 leading-relaxed">{modalAgent.description}</p>

            {/* Voice samples */}
            <div className="space-y-1 mb-3">
              {modalAgent.voiceSample.slice(0, 3).map((phrase, i) => (
                <div key={i} className="text-xs text-dim italic">› "{phrase}"</div>
              ))}
            </div>

            {/* Skills */}
            {modalAgent.skills.length > 0 && (
              <div className="border-t border-[#1A1A1A] pt-3 mb-3">
                <div className="text-dim text-xs mb-2">skills ({modalAgent.skills.length}):</div>
                <div className="space-y-1">
                  {modalAgent.skills.slice(0, 5).map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-green">$</span>
                      <span className="text-cyan font-mono">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {teamIds.includes(modalAgent.id) ? (
                <button
                  onClick={() => { removeAgent(modalAgent); setModalAgent(null) }}
                  className="term-btn text-xs py-1"
                  style={{ borderColor: '#FF3B3B', color: '#FF3B3B' }}
                >
                  [× remover]
                </button>
              ) : teamIds.length < MAX_TEAM ? (
                <button
                  onClick={() => { addAgent(modalAgent); setModalAgent(null) }}
                  className="term-btn term-btn-primary text-xs py-1"
                >
                  [+ agregar al equipo]
                </button>
              ) : (
                <span className="text-amber text-xs">[!] equipo completo</span>
              )}
              <button onClick={() => setModalAgent(null)} className="term-btn text-xs py-1">[cerrar]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
