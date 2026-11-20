import { describe, expect, it, vi } from 'vitest'
import { parseEmbedParams, postModuleComplete } from '../src/systems/lms'

describe('LMS embed helpers', () => {
  it('parses embed query params', () => {
    const params = parseEmbedParams(
      '?module=m01&courseId=ghe&learnerId=learner-1&embed=1',
    )
    expect(params).toEqual({
      moduleId: 'm01',
      courseId: 'ghe',
      learnerId: 'learner-1',
      embed: true,
    })
  })

  it('posts module completion to parent', () => {
    const postMessage = vi.fn()
    const target = { postMessage } as unknown as Window
    const payload = postModuleComplete(
      {
        moduleId: 'm01',
        badge: 'Hydrogen Explorer',
        score: 1,
        courseId: 'ghe',
        learnerId: 'learner-1',
      },
      target,
    )

    expect(payload.type).toBe('ghe:moduleComplete')
    expect(postMessage).toHaveBeenCalledWith(payload, '*')
  })
})
