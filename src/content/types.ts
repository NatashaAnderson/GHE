export type Outcome = {
  id: string
  label: string
}

export type ModuleDefinition = {
  id: string
  number: number
  title: string
  badge: string
  tagline: string
  durationMinutes: number
  locked: boolean
  hubSpawn: number[]
  portalPosition: number[]
  outcomes: Outcome[]
  stationOrder: string[]
  assets: Record<string, string>
  coachIntro: string
}

export type StationDefinition = {
  id: string
  title: string
  outcomeId: string
  secondaryOutcomeIds?: string[]
  position: number[]
  summary: string
  coachPrompt: string
  successCriteria: Record<string, unknown>
  facts?: string[]
  remember?: string[]
  wordToRemember?: { term: string; definition: string }
  teachingPoints?: string[]
  steps?: string[]
  flow?: string[]
  destinations?: Array<{ id: string; label: string; description: string }>
}

export type QuizChoice = { id: string; label: string }

export type QuizQuestion = {
  id: string
  prompt: string
  choices: QuizChoice[]
  correctId: string
  feedback: string
}

export type QuizDefinition = {
  moduleId: string
  title: string
  passScore: number
  instruction: string
  questions: QuizQuestion[]
}

export type CatalogModule = {
  id: string
  title: string
  locked: boolean
}

export type CourseCatalog = {
  courseId: string
  courseTitle: string
  brand: string
  modules: CatalogModule[]
}

export type ModulePack = {
  module: ModuleDefinition
  stations: StationDefinition[]
  quiz: QuizDefinition
}
