// ============================================================
// TEAMBUILDER — ChatPage · Deck Principal
// Santiago + Matías · v0.1
// ============================================================

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../data/agents.json'
import type { Agent } from '../types/agent'
import { DeckLayout } from '../components/layout/DeckLayout'
import { useChat } from '../hooks/useChat'

const allAgents = agentsData as Agent[]

function generateTeamName(ids: string[]): string {
  if (ids.length >= 8) return 'El Equipo Completo'
  if (ids.length >= 5) return 'El Equipo Expandido'
  if (ids.length >= 3) return 'El Núcleo'
  return 'Mi Equipo'
}

export function ChatPage() {
  const navigate = useNavigate()

  // Cargar agentes del equipo
  const teamIds: string[] = useMemo(() => {
    const raw = sessionStorage.getItem('team_agents')
    const ids: string[] = raw ? JSON.parse(raw) : ['rodrigo']
    // Rodrigo siempre presente
    if (!ids.includes('rodrigo')) ids.unshift('rodrigo')
    return ids
  }, [])

  const activeAgents = useMemo(() =>
    teamIds
      .map(id => allAgents.find(a => a.id === id))
      .filter((a): a is Agent => !!a)
  , [teamIds])

  const teamName = useMemo(() => generateTeamName(teamIds), [teamIds])

  const {
    messages,
    agentStates,
    mode,
    isLoading,
    error,
    excludeRodrigo,
    setExcludeRodrigo,
    sendUserMessage,
    likeMessage,
    dislikeMessage,
    readPendingOpinion,
    toggleMeeting,
    clearError,
  } = useChat(
    activeAgents,
    undefined,
    undefined,
    'free',
    import.meta.env.VITE_ANTHROPIC_API_KEY
  )

  return (
    <DeckLayout
      agents={activeAgents}
      agentStates={agentStates}
      messages={messages}
      mode={mode}
      isLoading={isLoading}
      error={error}
      excludeRodrigo={excludeRodrigo}
      teamName={teamName}
      projectName="Mi Proyecto"
      onSend={sendUserMessage}
      onLike={likeMessage}
      onDislike={dislikeMessage}
      onToggleMeeting={toggleMeeting}
      onToggleRodrigo={() => setExcludeRodrigo(prev => !prev)}
      onAgentClick={agent => navigate(`/catalogo/${agent.id}`)}
      onReadOpinion={readPendingOpinion}
      onNavigate={navigate}
      onClearError={clearError}
    />
  )
}
