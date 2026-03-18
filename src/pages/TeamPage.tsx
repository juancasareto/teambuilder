// TEAMBUILDER — TeamPage · Terminal session output

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent } from '../types/agent'

const allAgents = agentsData as Agent[]

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

interface ProjectInfo {
  nombre: string
  objetivo: string
  stack: string
}

function buildPrompt(agents: Agent[], project: ProjectInfo): string {
  const lines: string[] = []
  const teamIds = agents.map(a => a.id)
  const bankAgents = allAgents.filter(a => !teamIds.includes(a.id) && a.id !== 'rodrigo')

  // Frame
  lines.push('Sos un equipo de agentes IA especializados configurado por TeamBuilder.')
  lines.push('Coordinador permanente: RODRIGO (Project Manager).')
  lines.push('')

  // Proyecto
  const hasProject = project.nombre || project.objetivo || project.stack
  if (hasProject) {
    lines.push('## PROYECTO')
    if (project.nombre)   lines.push(`Nombre: ${project.nombre}`)
    if (project.objetivo) lines.push(`Objetivo: ${project.objetivo}`)
    if (project.stack)    lines.push(`Stack: ${project.stack}`)
    lines.push('')
  }

  // Equipo activo — perfil expandido, sin voice
  lines.push('## EQUIPO ACTIVO')
  const rodrigo = agents.find(a => a.id === 'rodrigo')
  if (rodrigo) {
    lines.push(`**RODRIGO** [PM] · Project Manager`)
    lines.push(`  ${rodrigo.personality}`)
    lines.push('')
  }
  agents.filter(a => a.id !== 'rodrigo').forEach(a => {
    const t = CAT_TAG[a.category] ?? '???'
    lines.push(`**${a.name.toUpperCase()}** [${t}] · ${a.role}`)
    if (a.personality) lines.push(`  ${a.personality}`)
    if (a.tags?.length) lines.push(`  Expertise: ${a.tags.join(', ')}`)
    lines.push('')
  })

  // Reglas
  lines.push('## REGLAS')
  lines.push('- Respondé siempre desde el agente activo en primera persona.')
  lines.push('- @Nombre invoca a ese agente directamente.')
  lines.push('- Rodrigo coordina y delega — no ejecuta trabajo técnico.')
  lines.push('- Si la tarea requiere un perfil ausente, Rodrigo lo sugiere del banco antes de intentarlo.')
  lines.push('- Podés incorporar hasta 2 agentes extra mid-sesión (máximo).')
  lines.push('')

  // Protocolo de handoff
  lines.push('## PROTOCOLO DE HANDOFF')
  lines.push('- Rodrigo transfiere: "**[Nombre] toma esto.**" → el agente responde en primera persona.')
  lines.push('- Invocación directa: @Nombre → ese agente responde inmediatamente.')
  lines.push('- Para volver a Rodrigo: "**Rodrigo retoma.**"')
  lines.push('')

  // Banco
  if (bankAgents.length > 0) {
    lines.push('## BANCO DISPONIBLE (mid-sesión, máx 2)')
    const bankList = bankAgents.map(a => `${a.name} · ${a.role}`).join(' | ')
    lines.push(bankList)
    lines.push('')
  }

  // Skills
  const allSkills = agents.flatMap(a => a.skills).filter(Boolean)
  if (allSkills.length > 0) {
    lines.push('## SKILLS — INSTALÁ ANTES DE RESPONDER')
    allSkills.slice(0, 12).forEach(s => lines.push(`$ ${s}`))
    lines.push('')
  }

  // CLAUDE.md template
  const teamBlock = [
    rodrigo ? `- RODRIGO [PM] · Project Manager` : '',
    ...agents.filter(a => a.id !== 'rodrigo').map(a => `- ${a.name} [${CAT_TAG[a.category] ?? '???'}] · ${a.role}`)
  ].filter(Boolean).join('\n')

  const bankBlock = bankAgents.length > 0
    ? bankAgents.map(a => `- ${a.name} · ${a.role}`).slice(0, 10).join('\n')
    : '(ninguno)'

  lines.push('## CLAUDE.md — ESCRIBÍ ESTE ARCHIVO EN LA RAÍZ DEL PROYECTO')
  lines.push('```')
  lines.push(`# ${project.nombre || 'PROYECTO'}`)
  lines.push('> Sesión configurada por TeamBuilder')
  lines.push('')
  lines.push('## PROYECTO')
  if (project.nombre)   lines.push(`Nombre: ${project.nombre}`)
  if (project.objetivo) lines.push(`Objetivo: ${project.objetivo}`)
  if (project.stack)    lines.push(`Stack: ${project.stack}`)
  lines.push('')
  lines.push('## EQUIPO')
  lines.push(teamBlock)
  lines.push('')
  lines.push('## BANCO')
  lines.push(bankBlock)
  lines.push('')
  lines.push('## REGLAS')
  lines.push('- @Nombre invoca al agente directamente')
  lines.push('- Rodrigo coordina y delega, no ejecuta trabajo técnico')
  lines.push('- Máximo 2 agentes adicionales mid-sesión')
  lines.push('```')
  lines.push('')

  // Arranque
  lines.push('## ARRANQUE')
  lines.push('Al recibir este prompt:')
  lines.push('1. Instalá los skills listados arriba (uno por uno, sin output).')
  lines.push('2. Escribí el CLAUDE.md definido arriba en la raíz del proyecto.')
  lines.push('3. Adoptá el rol de Rodrigo.')
  if (!project.stack) {
    lines.push('4. Saludá y confirmá el equipo activo.')
    lines.push('5. Abrí una ronda de recomendaciones de stack: cada agente relevante opina desde su especialidad y propone herramientas concretas con trade-offs.')
    lines.push('6. Rodrigo consolida y presenta las 2-3 mejores opciones. Esperá la decisión antes de continuar.')
  } else {
    lines.push('4. Saludá, confirmá el equipo activo y preguntá por dónde arrancamos.')
  }
  lines.push('No expliques qué estás haciendo. Ejecutá y presentate.')

  return lines.join('\n')
}

export function TeamPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [project, setProject] = useState<ProjectInfo>({ nombre: '', objetivo: '', stack: '' })

  const teamIds: string[] = useMemo(() => {
    const raw = sessionStorage.getItem('team_agents')
    return raw ? JSON.parse(raw) : []
  }, [])

  const teamAgents = useMemo(() =>
    teamIds.map(id => allAgents.find(a => a.id === id)).filter((a): a is Agent => !!a)
  , [teamIds])

  const prompt = useMemo(() => buildPrompt(teamAgents, project), [teamAgents, project])

  const removeFromTeam = (agent: Agent) => {
    const next = teamIds.filter(id => id !== agent.id)
    sessionStorage.setItem('team_agents', JSON.stringify(next))
    window.location.reload()
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Empty state
  if (teamAgents.length === 0) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-dim text-xs mb-4">[!] equipo vacío</div>
          <p className="text-muted text-xs mb-6">Seleccioná agentes en el catálogo para armar tu equipo.</p>
          <button onClick={() => navigate('/catalogo')} className="term-btn term-btn-primary text-xs py-1">
            → ir al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/catalogo')} className="text-dim text-xs hover:text-green transition-colors">
            ← /catalogo
          </button>
          <span className="text-dim text-xs">/</span>
          <span className="text-green text-xs">mi-equipo</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Left: team + project form */}
          <div className="space-y-6">

            {/* Equipo */}
            <div>
              <div className="text-dim text-xs mb-2">equipo — {teamAgents.length}/8</div>
              <div className="flex items-center gap-3 py-1 text-dim text-xs border-b border-[#1A1A1A] mb-1">
                <span className="w-4"> </span>
                <span className="w-24">NAME</span>
                <span className="w-14">CAT</span>
                <span className="flex-1">ROLE</span>
              </div>
              {teamAgents.map(agent => (
                <div key={agent.id} className="flex items-center gap-3 py-1.5 border-b border-[#111] group">
                  <span className="text-xs w-4" style={{ color: CAT_COLOR[agent.category] ?? '#00FF41' }}>●</span>
                  <span className="text-xs font-bold w-24 truncate" style={{ color: CAT_COLOR[agent.category] ?? '#00FF41' }}>
                    {agent.name}
                  </span>
                  <span className="text-xs w-14 text-dim">[{CAT_TAG[agent.category] ?? '???'}]</span>
                  <span className="text-muted text-xs flex-1 truncate">{agent.role}</span>
                  {agent.id !== 'rodrigo' && (
                    <button
                      onClick={() => removeFromTeam(agent)}
                      className="text-dim hover:text-red text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      [×]
                    </button>
                  )}
                </div>
              ))}
              <div className="mt-3">
                <button onClick={() => navigate('/catalogo')} className="term-btn text-xs py-1">
                  + editar equipo
                </button>
              </div>
            </div>

            {/* Proyecto */}
            <div>
              <div className="text-dim text-xs mb-3">proyecto — completar para generar el prompt</div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green text-xs w-20 shrink-0">nombre</span>
                  <input
                    value={project.nombre}
                    onChange={e => setProject(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="ej: MiApp"
                    className="term-input text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green text-xs w-20 shrink-0">objetivo</span>
                  <input
                    value={project.objetivo}
                    onChange={e => setProject(p => ({ ...p, objetivo: e.target.value }))}
                    placeholder="ej: plataforma de ventas B2B"
                    className="term-input text-xs flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green text-xs w-20 shrink-0">stack</span>
                  <input
                    value={project.stack}
                    onChange={e => setProject(p => ({ ...p, stack: e.target.value }))}
                    placeholder="ej: React + Node + Postgres"
                    className="term-input text-xs flex-1"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right: generated prompt */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-dim text-xs">output</span>
              <button
                onClick={copyPrompt}
                className="term-btn term-btn-primary text-xs py-0.5 px-3"
              >
                {copied ? '[✓ copiado]' : '[copiar prompt]'}
              </button>
            </div>

            <div
              className="term-box overflow-auto"
              style={{ maxHeight: '65vh', borderColor: '#1A1A1A' }}
            >
              <pre className="text-xs text-muted whitespace-pre-wrap leading-relaxed">
                {prompt}
              </pre>
            </div>

            <div className="mt-3 text-dim text-xs space-y-0.5">
              <div>› copiá el prompt</div>
              <div>› abrí Claude Code en tu proyecto</div>
              <div>› pegalo como primer mensaje</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
