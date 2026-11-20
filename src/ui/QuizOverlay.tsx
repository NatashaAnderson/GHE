import { useMemo, useState } from 'react'
import type { ModulePack } from '../content/types'
import { scoreQuiz } from '../systems/quiz'
import { useProgressStore } from '../systems/progress'

export function QuizOverlay({ pack }: { pack: ModulePack }) {
  const awardBadge = useProgressStore((s) => s.awardBadge)
  const setPhase = useProgressStore((s) => s.setPhase)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(
    () => (submitted ? scoreQuiz(pack.quiz, answers) : null),
    [answers, pack.quiz, submitted],
  )

  const allAnswered = pack.quiz.questions.every((question) => answers[question.id])

  return (
    <div className="overlay" data-testid="quiz-overlay">
      <div className="overlay-card">
        <header>
          <p className="eyebrow">Knowledge Check</p>
          <h2>{pack.quiz.title}</h2>
          <p>{pack.quiz.instruction}</p>
        </header>

        <div className="quiz-list">
          {pack.quiz.questions.map((question, index) => (
            <fieldset key={question.id} className="quiz-item">
              <legend>
                {index + 1}. {question.prompt}
              </legend>
              {question.choices.map((choice) => {
                const selected = answers[question.id] === choice.id
                const isCorrect = question.correctId === choice.id
                const showFeedback = submitted
                return (
                  <label
                    key={choice.id}
                    className={[
                      'quiz-choice',
                      selected ? 'selected' : '',
                      showFeedback && isCorrect ? 'correct' : '',
                      showFeedback && selected && !isCorrect ? 'incorrect' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={choice.id}
                      disabled={submitted && Boolean(result?.passed)}
                      checked={selected}
                      onChange={() =>
                        setAnswers((current) => ({ ...current, [question.id]: choice.id }))
                      }
                    />
                    <span>
                      {choice.id.toUpperCase()}. {choice.label}
                    </span>
                  </label>
                )
              })}
              {submitted && (
                <p className="quiz-feedback">{pack.quiz.questions.find((q) => q.id === question.id)?.feedback}</p>
              )}
            </fieldset>
          ))}
        </div>

        <footer className="overlay-actions">
          {!submitted && (
            <button
              type="button"
              data-testid="submit-quiz"
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
            >
              Submit answers
            </button>
          )}

          {result && !result.passed && (
            <>
              <p className="quiz-score">
                Score {Math.round(result.score * 100)}% — need {Math.round(pack.quiz.passScore * 100)}% to pass.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                }}
              >
                Try again
              </button>
            </>
          )}

          {result?.passed && (
            <>
              <p className="quiz-score success">
                Score {Math.round(result.score * 100)}% — mission clear!
              </p>
              <button
                type="button"
                data-testid="claim-badge"
                onClick={() => awardBadge(pack.module.id, pack.module.badge, result.score)}
              >
                Claim {pack.module.badge} badge
              </button>
            </>
          )}

          <button type="button" className="ghost" onClick={() => setPhase('module')}>
            Back to stations
          </button>
        </footer>
      </div>
    </div>
  )
}
