import type { QuizDefinition } from '../content/types'

export type QuizAnswers = Record<string, string>

export type QuizResult = {
  correct: number
  total: number
  score: number
  passed: boolean
  missed: string[]
}

export const scoreQuiz = (quiz: QuizDefinition, answers: QuizAnswers): QuizResult => {
  const total = quiz.questions.length
  let correct = 0
  const missed: string[] = []

  for (const question of quiz.questions) {
    if (answers[question.id] === question.correctId) {
      correct += 1
    } else {
      missed.push(question.id)
    }
  }

  const score = total === 0 ? 0 : correct / total
  return {
    correct,
    total,
    score,
    passed: score >= quiz.passScore,
    missed,
  }
}
