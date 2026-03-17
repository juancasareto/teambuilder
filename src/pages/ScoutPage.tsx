// ============================================================
// TEAMBUILDER — ScoutPage
// Santiago · v0.1 — Diagnóstico 5 preguntas
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { copy } from '../data/copy'
import type { DiagnosticAnswer } from '../types/project'

const { questions, unknownOption, progress, cta } = copy.diagnostic

export function ScoutPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const question = questions[current]
  const isLast = current === questions.length - 1
  const progressText = progress(current + 1, questions.length)

  const handleSelect = (option: string) => setSelected(option)

  const handleNext = () => {
    if (!selected) return
    const newAnswers: DiagnosticAnswer[] = [
      ...answers,
      {
        questionId: question.id,
        answer: selected === unknownOption ? 'unknown' : selected,
      },
    ]
    setAnswers(newAnswers)
    setSelected(null)

    if (isLast) {
      // Guardar respuestas y navegar a propuesta
      sessionStorage.setItem('scout_answers', JSON.stringify(newAnswers))
      navigate('/scout/propuesta')
    } else {
      setCurrent(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (current === 0) { navigate('/'); return }
    setAnswers(prev => prev.slice(0, -1))
    setSelected(null)
    setCurrent(prev => prev - 1)
  }

  const progressPct = ((current) / questions.length) * 100

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-muted mb-2">
            <span>Diagnóstico</span>
            <span>{progressText}</span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Pregunta */}
        <div className="mb-8 animate-fade-up" key={current}>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
            {question.question}
          </h2>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[...question.options, unknownOption].map((option, i) => {
            const isUnknown = option === unknownOption
            const isSelected = selected === option
            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`
                  p-4 rounded-xl text-left text-sm transition-all duration-200
                  border animate-fade-up
                  ${isSelected
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-border bg-surface text-text-muted hover:border-accent/30 hover:text-text-primary'}
                  ${isUnknown ? 'col-span-full sm:col-span-1 italic' : ''}
                `}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {isSelected && <span className="text-accent mr-2">✓</span>}
                {option}
              </button>
            )
          })}
        </div>

        {/* Navegación */}
        <div className="flex justify-between">
          <button onClick={handleBack} className="btn-ghost">
            ← Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? cta : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}
