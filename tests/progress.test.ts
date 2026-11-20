import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProgressStore } from '../src/systems/progress'

describe('progress store', () => {
  beforeEach(() => {
    useProgressStore.setState({
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
    })
  })

  it('tracks station completion and opens quiz readiness', () => {
    const store = useProgressStore.getState()
    store.startModule('m01')
    store.completeStation('m01', 'meet-hydrogen')
    store.completeStation('m01', 'bonding-lab')
    expect(useProgressStore.getState().isStationComplete('m01', 'meet-hydrogen')).toBe(true)
    expect(
      useProgressStore
        .getState()
        .allStationsComplete('m01', ['meet-hydrogen', 'bonding-lab']),
    ).toBe(true)
  })

  it('awards badge and emits completion event', () => {
    const handler = vi.fn()
    window.addEventListener('ghe:moduleComplete', handler as EventListener)
    useProgressStore.getState().awardBadge('m01', 'Hydrogen Explorer', 1)
    expect(useProgressStore.getState().earnedBadges).toContain('Hydrogen Explorer')
    expect(useProgressStore.getState().phase).toBe('badge')
    expect(handler).toHaveBeenCalled()
    window.removeEventListener('ghe:moduleComplete', handler as EventListener)
  })
})
