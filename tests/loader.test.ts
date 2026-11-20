import { describe, expect, it } from 'vitest'
import { getCatalog, loadModulePack } from '../src/content/loader'

describe('content loader', () => {
  it('loads course catalog with eight modules', () => {
    const catalog = getCatalog()
    expect(catalog.modules).toHaveLength(8)
    expect(catalog.modules[0]?.id).toBe('m01')
    expect(catalog.modules[0]?.locked).toBe(false)
  })

  it('loads Module 1 pack with four stations and quiz', () => {
    const pack = loadModulePack('m01')
    expect(pack).not.toBeNull()
    expect(pack?.module.badge).toBe('Hydrogen Explorer')
    expect(pack?.stations).toHaveLength(4)
    expect(pack?.quiz.questions.length).toBeGreaterThanOrEqual(5)
  })
})
