// TEAMBUILDER — WelcomePage · Terminal boot screen

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGO = `
 ████████╗███████╗ █████╗ ███╗   ███╗
    ██╔══╝██╔════╝██╔══██╗████╗ ████║
    ██║   █████╗  ███████║██╔████╔██║
    ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
 ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗
 ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗
 ██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝
 ██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗
 ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║
 ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝
`.trim()

const BOOT_LINES = [
  { text: 'TEAMBUILDER v0.2', color: '#00FF41', delay: 0 },
  { text: '─'.repeat(48), color: '#1A1A1A', delay: 80 },
  { text: 'Initializing agent registry...', color: '#444', delay: 160 },
  { text: '[OK] 50 agents loaded', color: '#00FF41', delay: 280 },
  { text: '[OK] Skills catalog ready', color: '#00FF41', delay: 380 },
  { text: '[OK] Prompt engine online', color: '#00FF41', delay: 480 },
  { text: '─'.repeat(48), color: '#1A1A1A', delay: 560 },
  { text: 'Select mode to continue.', color: '#555', delay: 640 },
]

export function WelcomePage() {
  const navigate = useNavigate()
  const [visibleLines, setVisibleLines] = useState(0)
  const [menuReady, setMenuReady] = useState(false)
  const [selected, setSelected] = useState<'forge' | 'scout' | null>(null)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1)
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setMenuReady(true), 200)
        }
      }, line.delay)
    })
  }, [])

  const go = (mode: 'forge' | 'scout') => {
    setSelected(mode)
    setTimeout(() => {
      if (mode === 'forge') navigate('/catalogo?mode=forge')
      else navigate('/scout')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">

        {/* ASCII Logo */}
        <pre
          className="text-xs leading-tight mb-6 select-none overflow-x-auto"
          style={{
            color: '#00FF41',
            textShadow: '0 0 8px rgba(0,255,65,0.6), 0 0 20px rgba(0,255,65,0.2)',
            fontFamily: 'Geist Mono, monospace',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}
        >
          {LOGO}
        </pre>

        {/* Boot lines */}
        <div className="mb-6 space-y-0.5">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="font-term text-xs tracking-wide"
              style={{ color: line.color }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Menu */}
        {menuReady && (
          <div className="space-y-3">

            {/* FORGE */}
            <button
              onClick={() => go('forge')}
              className="w-full text-left term-box group transition-all duration-150"
              style={selected === 'forge' ? { borderColor: '#00FF41' } : {}}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-green font-bold tracking-widest text-xs">[1] FORGE</span>
                <span className="text-dim text-xs">─── manual mode</span>
              </div>
              <div className="text-xs text-muted pl-4">
                Explorás el catálogo y elegís tu equipo.
                <br />
                Output: prompt listo para Claude Code.
              </div>
              <div className="mt-3 text-xs text-dim group-hover:text-green transition-colors">
                &gt; Armar mi equipo →
              </div>
            </button>

            {/* SCOUT */}
            <button
              onClick={() => go('scout')}
              className="w-full text-left term-box group transition-all duration-150"
              style={selected === 'scout' ? { borderColor: '#00FF41' } : {}}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-green font-bold tracking-widest text-xs">[2] SCOUT</span>
                <span className="text-dim text-xs">─── guided mode</span>
              </div>
              <div className="text-xs text-muted pl-4">
                Describís tu proyecto, el sistema recomienda el equipo.
                <br />
                Output: prompt + equipo curado.
              </div>
              <div className="mt-3 text-xs text-dim group-hover:text-green transition-colors">
                &gt; Empezar diagnóstico →
              </div>
            </button>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-between text-dim text-xs">
              <span>teambuilder.sh</span>
              <span className="text-green" style={{ animation: 'blink 1s step-end infinite' }}>█</span>
            </div>
          </div>
        )}

        {/* Blinking underscore while booting */}
        {!menuReady && (
          <div className="text-green text-xs" style={{ animation: 'blink 0.8s step-end infinite' }}>_</div>
        )}
      </div>
    </div>
  )
}
