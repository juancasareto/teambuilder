// ============================================================
// TEAMBUILDER — DeckLayout
// Santiago · v0.1
// Layout principal: Sidebar + Chat area
// ============================================================

import { useRef, useEffect, useState, type KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Agent } from '../../types/agent'
import type { ChatMessage } from '../../types/project'
import type { AgentState, ChatMode } from '../../hooks/useChat'
import { Sidebar } from './Sidebar'
import { AgentAvatar } from '../agents/AgentAvatar'

interface Props {
  agents: Agent[]
  agentStates: Record<string, AgentState>
  messages: ChatMessage[]
  mode: ChatMode
  isLoading: boolean
  error: string | null
  excludeRodrigo: boolean
  teamName?: string
  projectName?: string
  onSend: (text: string) => void
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onToggleMeeting: () => void
  onToggleRodrigo: () => void
  onAgentClick: (agent: Agent) => void
  onReadOpinion: (agentId: string) => void
  onNavigate: (path: string) => void
  onClearError: () => void
}

const AGENT_COLOR_MAP: Record<string, string> = {
  estrategico: '#6366F1',
  tecnico: '#10B981',
  creativo: '#F59E0B',
  datos: '#8B5CF6',
  social: '#EC4899',
  diseno: '#06B6D4',
  seguridad: '#EF4444',
}

function getAgentById(agents: Agent[], id: string): Agent | undefined {
  return agents.find(a => a.id === id)
}

// ── Componente de mensaje ─────────────────────────────────────
function ChatBubble({
  message,
  agent,
  onLike,
  onDislike,
}: {
  message: ChatMessage
  agent?: Agent
  onLike: () => void
  onDislike: () => void
}) {
  const isUser = message.sender === 'user'
  const accentColor = agent ? AGENT_COLOR_MAP[agent.category] : '#10B981'

  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && agent && (
        <AgentAvatar agent={agent} size="sm" showDot={false} className="mt-1 shrink-0" />
      )}

      <div className={`flex flex-col gap-1.5 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Nombre del agente */}
        {!isUser && agent && (
          <span className="text-xs font-medium px-1" style={{ color: accentColor }}>
            {agent.emoji} {agent.name}
          </span>
        )}

        {/* Burbuja */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-accent/20 text-text-primary rounded-tr-sm border border-accent/20'
              : 'bg-surface text-text-primary rounded-tl-sm border border-border'}
          `}
          style={!isUser ? { borderColor: `${accentColor}20` } : {}}
        >
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
                ul: ({ children }) => <ul className="mt-1 mb-2 space-y-1 pl-4 list-none">{children}</ul>,
                ol: ({ children }) => <ol className="mt-1 mb-2 space-y-1 pl-4 list-decimal">{children}</ol>,
                li: ({ children }) => (
                  <li className="flex gap-2 items-start">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                    <span>{children}</span>
                  </li>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-base border border-border text-accent">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mt-2 mb-2 p-3 rounded-xl bg-base border border-border overflow-x-auto text-xs font-mono text-text-primary">
                    {children}
                  </pre>
                ),
                h3: ({ children }) => <h3 className="font-semibold text-text-primary mt-2 mb-1">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 pl-3 my-2 italic text-text-muted" style={{ borderColor: accentColor }}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Like / Dislike */}
        {!isUser && (
          <div className="flex items-center gap-3 px-1">
            <button
              onClick={onLike}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
            >
              <span>👍</span>
              {message.likes > 0 && <span>{message.likes}</span>}
            </button>
            <button
              onClick={onDislike}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <span>👎</span>
              {message.dislikes > 0 && <span>{message.dislikes}</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Layout principal ──────────────────────────────────────────
export function DeckLayout({
  agents,
  agentStates,
  messages,
  mode,
  isLoading,
  error,
  excludeRodrigo,
  teamName,
  projectName,
  onSend,
  onLike,
  onDislike,
  onToggleMeeting,
  onToggleRodrigo,
  onAgentClick,
  onReadOpinion,
  onNavigate,
  onClearError,
}: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Detectar @mención en el input para cambiar placeholder
  const mentionMatch = input.match(/@(\w+)/)?.[1]
  const mentionedAgent = mentionMatch
    ? agents.find(a => a.name.toLowerCase().startsWith(mentionMatch.toLowerCase()))
    : null

  const placeholder = mode === 'meeting'
    ? 'Reunión en curso. Todos están escuchando...'
    : mentionedAgent
    ? `Mencionaste a ${mentionedAgent.name}. Escribí tu mensaje...`
    : 'Escribile a Rodrigo... (o @Nombre para hablar con alguien)'

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* Sidebar */}
      <Sidebar
        agents={agents}
        agentStates={agentStates}
        projectName={projectName}
        teamName={teamName}
        mode={mode}
        excludeRodrigo={excludeRodrigo}
        onToggleMeeting={onToggleMeeting}
        onToggleRodrigo={onToggleRodrigo}
        onAgentClick={onAgentClick}
        onReadOpinion={onReadOpinion}
        onNavigate={onNavigate}
      />

      {/* Área de chat */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barra superior */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50 backdrop-blur-xs shrink-0">
          <div>
            <h1 className="font-display font-bold text-text-primary">
              {mode === 'meeting' ? '⚡ Reunión en curso' : teamName ?? 'Mi Equipo'}
            </h1>
            {mode !== 'meeting' && (
              <p className="text-text-muted text-sm">{projectName}</p>
            )}
          </div>
          {mode === 'meeting' && (
            <button
              onClick={onToggleMeeting}
              className="text-sm text-text-muted hover:text-text-primary transition-colors border border-border px-3 py-1.5 rounded-lg"
            >
              Terminar reunión
            </button>
          )}
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Estado vacío */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="text-text-muted text-lg">El equipo está listo. Vos arrancás.</p>
              <p className="text-text-muted/60 text-sm">
                Escribile a Rodrigo o invocá a quien necesites con @Nombre
              </p>
            </div>
          )}

          {/* Mensajes */}
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              message={msg}
              agent={getAgentById(agents, msg.sender)}
              onLike={() => onLike(msg.id)}
              onDislike={() => onDislike(msg.id)}
            />
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center">
                <span className="animate-pulse">...</span>
              </div>
              <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <span className="text-red-400 text-sm">{error}</span>
              <button
                onClick={onClearError}
                className="ml-auto text-red-400/60 hover:text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border bg-surface/50 backdrop-blur-xs shrink-0">
          <div className="flex gap-3 items-end max-w-chat-max mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className={`
                  w-full bg-base border rounded-xl px-4 py-3 pr-12
                  text-sm text-text-primary placeholder:text-text-muted
                  resize-none focus:outline-none transition-colors duration-200
                  max-h-32
                  ${mentionedAgent
                    ? 'border-accent/40 focus:border-accent/60'
                    : 'border-border focus:border-accent/30'}
                `}
                style={{ lineHeight: '1.5' }}
                onInput={e => {
                  const el = e.currentTarget
                  el.style.height = 'auto'
                  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              →
            </button>
          </div>
          <p className="text-center text-text-muted/40 text-xs mt-2">
            Enter para enviar · Shift+Enter para salto de línea
          </p>
        </div>
      </main>
    </div>
  )
}
