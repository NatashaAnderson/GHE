import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { postModuleComplete } from './lms'

export type AppPhase =
  | 'hub'
  | 'module'
  | 'quiz'
  | 'badge'

type ProgressState = {
  activeModuleId: string | null
  phase: AppPhase
  completedStations: Record<string, string[]>
  stationFlags: Record<string, Record<string, boolean>>
  quizScores: Record<string, number>
  earnedBadges: string[]
  courseId: string | null
  learnerId: string | null
  embedMode: boolean
  reduceMotion: boolean
  focusedStationId: string | null
  lastInsight: string | null
  setEmbedContext: (ctx: {
    courseId: string | null
    learnerId: string | null
    embedMode: boolean
  }) => void
  enterHub: () => void
  startModule: (moduleId: string) => void
  setPhase: (phase: AppPhase) => void
  setFocusedStationId: (stationId: string | null) => void
  setLastInsight: (insight: string | null) => void
  markInteraction: (moduleId: string, stationId: string, flag: string) => void
  completeStation: (moduleId: string, stationId: string) => void
  isStationComplete: (moduleId: string, stationId: string) => boolean
  allStationsComplete: (moduleId: string, stationIds: string[]) => boolean
  recordQuizScore: (moduleId: string, score: number) => void
  awardBadge: (moduleId: string, badge: string, score: number) => void
  setReduceMotion: (value: boolean) => void
  resetModule: (moduleId: string) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      activeModuleId: null,
      phase: 'hub',
      completedStations: {},
      stationFlags: {},
      quizScores: {},
      earnedBadges: [],
      courseId: null,
      learnerId: null,
      embedMode: false,
      reduceMotion: false,
      focusedStationId: null,
      lastInsight: null,

      setEmbedContext: (ctx) => set(ctx),

      enterHub: () =>
        set({ phase: 'hub', activeModuleId: null, focusedStationId: null, lastInsight: null }),

      startModule: (moduleId) =>
        set({
          activeModuleId: moduleId,
          phase: 'module',
          focusedStationId: null,
          lastInsight: null,
        }),

      setPhase: (phase) => set({ phase }),

      setFocusedStationId: (stationId) => {
        if (get().focusedStationId === stationId) return
        set({ focusedStationId: stationId })
      },

      setLastInsight: (insight) => set({ lastInsight: insight }),

      markInteraction: (moduleId, stationId, flag) => {
        const key = `${moduleId}:${stationId}`
        const current = get().stationFlags[key] ?? {}
        set({
          stationFlags: {
            ...get().stationFlags,
            [key]: { ...current, [flag]: true },
          },
        })
      },

      completeStation: (moduleId, stationId) => {
        const list = get().completedStations[moduleId] ?? []
        if (list.includes(stationId)) return
        set({
          completedStations: {
            ...get().completedStations,
            [moduleId]: [...list, stationId],
          },
        })
      },

      isStationComplete: (moduleId, stationId) =>
        (get().completedStations[moduleId] ?? []).includes(stationId),

      allStationsComplete: (moduleId, stationIds) => {
        const done = new Set(get().completedStations[moduleId] ?? [])
        return stationIds.every((id) => done.has(id))
      },

      recordQuizScore: (moduleId, score) =>
        set({
          quizScores: { ...get().quizScores, [moduleId]: score },
        }),

      awardBadge: (moduleId, badge, score) => {
        const earned = get().earnedBadges
        if (!earned.includes(badge)) {
          set({ earnedBadges: [...earned, badge] })
        }
        get().recordQuizScore(moduleId, score)
        postModuleComplete({
          moduleId,
          badge,
          score,
          courseId: get().courseId,
          learnerId: get().learnerId,
        })
        set({ phase: 'badge' })
      },

      setReduceMotion: (value) => set({ reduceMotion: value }),

      resetModule: (moduleId) => {
        const completedStations = { ...get().completedStations }
        delete completedStations[moduleId]
        const stationFlags = { ...get().stationFlags }
        Object.keys(stationFlags).forEach((key) => {
          if (key.startsWith(`${moduleId}:`)) delete stationFlags[key]
        })
        const quizScores = { ...get().quizScores }
        delete quizScores[moduleId]
        set({ completedStations, stationFlags, quizScores })
      },
    }),
    {
      name: 'ghe-progress-v1',
      partialize: (state) => ({
        completedStations: state.completedStations,
        stationFlags: state.stationFlags,
        quizScores: state.quizScores,
        earnedBadges: state.earnedBadges,
        reduceMotion: state.reduceMotion,
      }),
    },
  ),
)
