import { describe, expect, it } from 'vitest'
import { loadModulePack } from '../src/content/loader'
import { scoreQuiz } from '../src/systems/quiz'

describe('scoreQuiz', () => {
  const pack = loadModulePack('m01')
  if (!pack) throw new Error('m01 pack missing')

  it('passes when all answers are correct', () => {
    const answers = Object.fromEntries(
      pack.quiz.questions.map((question) => [question.id, question.correctId]),
    )
    const result = scoreQuiz(pack.quiz, answers)
    expect(result.passed).toBe(true)
    expect(result.score).toBe(1)
    expect(result.missed).toEqual([])
  })

  it('fails below pass score', () => {
    const answers = Object.fromEntries(
      pack.quiz.questions.map((question) => [
        question.id,
        question.correctId === 'a' ? 'b' : 'a',
      ]),
    )
    const result = scoreQuiz(pack.quiz, answers)
    expect(result.passed).toBe(false)
    expect(result.correct).toBe(0)
  })
})
