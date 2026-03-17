// ============================================================
// TEAMBUILDER — WelcomePage
// Santiago + Ramiro · v0.1
// Pantalla 1: FORGE vs SCOUT
// ============================================================

import { useNavigate } from 'react-router-dom'
import { copy } from '../data/copy'

export function WelcomePage() {
  const navigate = useNavigate()
  const { welcome } = copy

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6">
      {/* Headline */}
      <div className="text-center mb-16 animate-fade-up">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-4 leading-tight">
          {welcome.headline}
          <br />
          <span className="text-gradient">{welcome.subheadline}</span>
        </h1>
        <p className="text-text-muted text-lg max-w-md mx-auto whitespace-pre-line">
          {welcome.description}
        </p>
      </div>

      {/* Modos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-up stagger-2">
        {/* FORGE */}
        <button
          onClick={() => navigate('/catalogo?mode=forge')}
          className="group card p-8 text-left hover:border-accent/30 hover:shadow-glow-accent transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚡</span>
            <span className="font-display text-2xl font-bold text-text-primary">
              {welcome.modes.forge.title}
            </span>
          </div>
          <p className="text-accent font-medium mb-2">
            {welcome.modes.forge.tagline}
          </p>
          <p className="text-text-muted text-sm mb-6">
            {welcome.modes.forge.description}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
            {welcome.modes.forge.cta} →
          </span>
        </button>

        {/* SCOUT */}
        <button
          onClick={() => navigate('/scout')}
          className="group card p-8 text-left hover:border-accent/30 hover:shadow-glow-accent transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <span className="font-display text-2xl font-bold text-text-primary">
              {welcome.modes.scout.title}
            </span>
          </div>
          <p className="text-accent font-medium mb-2">
            {welcome.modes.scout.tagline}
          </p>
          <p className="text-text-muted text-sm mb-6">
            {welcome.modes.scout.description}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
            {welcome.modes.scout.cta} →
          </span>
        </button>
      </div>

      {/* Footer mínimo */}
      <p className="mt-12 text-text-muted/40 text-xs animate-fade-up stagger-4">
        TeamBuilder v0.1 · Build in public
      </p>
    </div>
  )
}
