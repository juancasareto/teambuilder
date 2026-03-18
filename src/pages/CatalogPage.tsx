// TEAMBUILDER — CatalogPage · Terminal listing

import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent, AgentCategory } from '../types/agent'
import { AgentCard } from '../components/agents/AgentCard'

const allAgents = agentsData as Agent[]

const CAT_TAG_MAP: Record<string, string> = {
  estrategico: 'STRAT',
  tecnico:     'TECH',
  creativo:    'CREAT',
  datos:       'DATA',
  social:      'SOC',
  diseno:      'DSGN',
  seguridad:   'SEC',
}

function downloadAgentsBank() {
  const lines: string[] = []
  lines.push('# TEAMBUILDER — BANCO DE AGENTES')
  lines.push('> Archivo de referencia para sesiones de Claude Code.')
  lines.push('> Cargalo con: @agents-bank.md o pegá su contenido como contexto.')
  lines.push('')
  lines.push(`Total: ${allAgents.length} agentes · 7 categorías`)
  lines.push('')
  lines.push('---')
  lines.push('')

  allAgents.forEach(a => {
    const tag = CAT_TAG_MAP[a.category] ?? '???'
    lines.push(`## ${a.name.toUpperCase()} — ${a.role} [${tag}]`)
    lines.push('')
    if (a.personality) {
      lines.push(`**Personalidad:** ${a.personality}`)
      lines.push('')
    }
    if (a.description) {
      lines.push(`**Bio:** ${a.description}`)
      lines.push('')
    }
    if (a.voiceSample?.length) {
      lines.push(`**Frases:** ${a.voiceSample.map(v => `"${v}"`).join(' / ')}`)
      lines.push('')
    }
    if (a.tags?.length) {
      lines.push(`**Expertise:** ${a.tags.join(', ')}`)
      lines.push('')
    }
    if (a.examples?.length) {
      lines.push('**Ejemplos de uso:**')
      a.examples.forEach(ex => lines.push(`- ${ex}`))
      lines.push('')
    }
    if (a.skills?.length) {
      lines.push('**Skills:**')
      a.skills.forEach(s => lines.push(`- \`${s}\``))
      lines.push('')
    }
    lines.push(`**Invocar:** ${(a.invokeWith ?? [`@${a.name}`]).join(' / ')}`)
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'agents-bank.md'
  a.click()
  URL.revokeObjectURL(url)
}

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
          <div className="flex items-center gap-3">
            <span>{filtered.length} agentes · {teamIds.length}/{MAX_TEAM} seleccionados</span>
            <button
              onClick={downloadAgentsBank}
              className="term-btn text-xs py-0.5"
              title="Descargá el banco completo como .md para usarlo en cualquier sesión de Claude Code"
            >
              [↓ agents-bank.md]
            </button>
          </div>
          {teamIds.length > 0 && (
            <button onClick={() => navigate('/equipo')} className="term-btn term-btn-primary text-xs py-1">
              generar prompt →
            </button>
          )}
        </div>
      </div>

      {/* Agent profile modal */}
      {modalAgent && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ background: 'rgba(8,8,8,0.94)', zIndex: 1000 }}
          onClick={() => setModalAgent(null)}
        >
          <div
            className="term-box w-full overflow-y-auto"
            style={{ borderColor: '#2A2A2A', maxWidth: '580px', maxHeight: '88vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#1A1A1A]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: modalAgent.color ?? '#00FF41' }}>
                    {modalAgent.emoji} {modalAgent.name}
                  </span>
                  <span className="text-dim text-xs">[{CAT_TAG_MAP[modalAgent.category] ?? '???'}]</span>
                </div>
                <div className="text-muted text-xs">{modalAgent.role}</div>
              </div>
              <button onClick={() => setModalAgent(null)} className="text-dim hover:text-base text-xs ml-4 shrink-0">[esc]</button>
            </div>

            {/* Personalidad */}
            {modalAgent.personality && (
              <div className="mb-4">
                <div className="text-dim text-xs mb-1">personalidad</div>
                <p className="text-xs leading-relaxed" style={{ color: modalAgent.color ?? '#00FF41' }}>
                  {modalAgent.personality}
                </p>
              </div>
            )}

            {/* Bio */}
            {modalAgent.description && (
              <div className="mb-4">
                <div className="text-dim text-xs mb-1">bio</div>
                <p className="text-muted text-xs leading-relaxed">{modalAgent.description}</p>
              </div>
            )}

            {/* Voice samples */}
            {modalAgent.voiceSample.length > 0 && (
              <div className="mb-4">
                <div className="text-dim text-xs mb-1">frases características</div>
                <div className="space-y-1">
                  {modalAgent.voiceSample.map((phrase, i) => (
                    <div key={i} className="text-xs text-muted italic pl-2 border-l border-[#222]">
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags / Expertise */}
            {modalAgent.tags?.length > 0 && (
              <div className="mb-4">
                <div className="text-dim text-xs mb-1">expertise</div>
                <div className="flex flex-wrap gap-1">
                  {modalAgent.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 border border-[#1E1E1E] text-dim">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ejemplos de uso */}
            {modalAgent.examples?.length > 0 && (
              <div className="mb-4 border-t border-[#1A1A1A] pt-3">
                <div className="text-dim text-xs mb-1">ejemplos de uso</div>
                <div className="space-y-1">
                  {modalAgent.examples.map((ex, i) => (
                    <div key={i} className="text-xs text-muted">
                      <span className="text-green mr-1">›</span>{ex}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {modalAgent.skills.length > 0 && (
              <div className="mb-4 border-t border-[#1A1A1A] pt-3">
                <div className="text-dim text-xs mb-1">skills ({modalAgent.skills.length})</div>
                <div className="space-y-1">
                  {modalAgent.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-green shrink-0">$</span>
                      <span className="text-cyan font-mono break-all">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invocar */}
            {modalAgent.invokeWith?.length > 0 && (
              <div className="mb-4 border-t border-[#1A1A1A] pt-3">
                <div className="text-dim text-xs mb-1">cómo invocarlo</div>
                <div className="flex gap-2">
                  {modalAgent.invokeWith.map((inv, i) => (
                    <span key={i} className="text-xs text-green font-bold">{inv}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[#1A1A1A]">
              {teamIds.includes(modalAgent.id) ? (
                <button
                  onClick={() => { removeAgent(modalAgent); setModalAgent(null) }}
                  className="term-btn text-xs py-1"
                  style={{ borderColor: '#FF3B3B', color: '#FF3B3B' }}
                >
                  [× remover del equipo]
                </button>
              ) : teamIds.length < MAX_TEAM ? (
                <button
                  onClick={() => { addAgent(modalAgent); setModalAgent(null) }}
                  className="term-btn term-btn-primary text-xs py-1"
                >
                  [+ agregar al equipo]
                </button>
              ) : (
                <span className="text-amber text-xs self-center">[!] equipo completo</span>
              )}
              <button onClick={() => setModalAgent(null)} className="term-btn text-xs py-1">[cerrar]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
