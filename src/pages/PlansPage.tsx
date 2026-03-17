// ============================================================
// TEAMBUILDER — PlansPage · Planes (mock pago)
// Santiago · v0.1
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import plansData from '../data/plans.json'
import type { Plan } from '../types/project'
import { copy } from '../data/copy'

const plans = plansData as Plan[]
const { headline, subheadline, mockPayment } = copy.plans

const PLAN_COLORS: Record<string, string> = {
  free: '#6B7280',
  pro: '#10B981',
  enterprise: '#6366F1',
}

export function PlansPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [activated, setActivated] = useState(false)

  const handleActivate = () => {
    if (cardNumber.replace(/\s/g, '').length >= 16) {
      setActivated(true)
      setTimeout(() => navigate('/equipo/chat'), 2000)
    }
  }

  if (activated) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <p className="text-5xl mb-4">✓</p>
          <p className="font-display text-2xl text-text-primary font-bold">
            {mockPayment.success}
          </p>
          <p className="text-text-muted mt-2 text-sm">{mockPayment.disclaimer}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <button
            onClick={() => navigate(-1)}
            className="text-text-muted text-sm hover:text-text-primary transition-colors mb-4 block mx-auto"
          >
            ← Volver
          </button>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-3">
            {headline}
          </h1>
          <p className="text-text-muted">{subheadline}</p>
        </div>

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => {
            const color = PLAN_COLORS[plan.tier]
            const isSelected = selectedPlan?.tier === plan.tier
            const isFree = plan.tier === 'free'

            return (
              <div
                key={plan.tier}
                onClick={() => !isFree && setSelectedPlan(plan)}
                className={`
                  card p-6 flex flex-col gap-4 animate-fade-up
                  ${!isFree ? 'cursor-pointer' : ''}
                  ${isSelected ? 'border-opacity-60' : ''}
                  transition-all duration-300
                `}
                style={{
                  borderColor: isSelected ? color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${color}20` : undefined,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {/* Plan header */}
                <div>
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {plan.name}
                  </span>
                  <div className="mt-4">
                    {isFree ? (
                      <span className="font-display text-3xl font-bold text-text-primary">Gratis</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-text-muted text-sm">$</span>
                        <span className="font-display text-3xl font-bold text-text-primary">
                          {(plan.price / 100).toFixed(0)}
                        </span>
                        <span className="text-text-muted text-sm">/mes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-text-muted">
                      <span style={{ color }} className="mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {!isFree && (
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? color : `${color}20`,
                      color: isSelected ? '#0A0A0F' : color,
                    }}
                  >
                    {isSelected ? 'Seleccionado ✓' : 'Seleccionar'}
                  </button>
                )}
                {isFree && (
                  <button
                    onClick={() => navigate('/equipo/chat')}
                    className="w-full py-2.5 rounded-xl text-sm font-medium border border-border text-text-muted hover:text-text-primary hover:border-accent/20 transition-all"
                  >
                    Plan actual
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Mock payment */}
        {selectedPlan && (
          <div className="max-w-md mx-auto card p-6 animate-fade-up">
            <h3 className="font-display text-xl font-bold text-text-primary mb-1">
              {mockPayment.headline} {selectedPlan.name}
            </h3>
            <p className="text-text-muted text-xs mb-4 italic">{mockPayment.disclaimer}</p>

            <label className="block text-text-muted text-sm mb-1">
              {mockPayment.cardLabel}
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                setCardNumber(val.replace(/(.{4})/g, '$1 ').trim())
              }}
              placeholder={mockPayment.cardPlaceholder}
              className="w-full bg-base border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-mono mb-4 focus:outline-none focus:border-accent/40"
            />
            <button
              onClick={handleActivate}
              disabled={cardNumber.replace(/\s/g, '').length < 16}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {mockPayment.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
