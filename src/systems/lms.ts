export type EmbedParams = {
  moduleId: string | null
  courseId: string | null
  learnerId: string | null
  embed: boolean
}

export type ModuleCompletePayload = {
  type: 'ghe:moduleComplete'
  moduleId: string
  badge: string
  score: number
  courseId: string | null
  learnerId: string | null
}

const readParam = (params: URLSearchParams, key: string): string | null => {
  const value = params.get(key)
  return value && value.trim() ? value.trim() : null
}

export const parseEmbedParams = (search: string = window.location.search): EmbedParams => {
  const params = new URLSearchParams(search)
  const pathEmbed = window.location.pathname.includes('/embed')
  return {
    moduleId: readParam(params, 'module'),
    courseId: readParam(params, 'courseId'),
    learnerId: readParam(params, 'learnerId'),
    embed: pathEmbed || params.get('embed') === '1' || params.get('embed') === 'true',
  }
}

export const postModuleComplete = (
  payload: Omit<ModuleCompletePayload, 'type'>,
  target: Window = window.parent,
): ModuleCompletePayload => {
  const message: ModuleCompletePayload = {
    type: 'ghe:moduleComplete',
    ...payload,
  }

  if (target && target !== window) {
    target.postMessage(message, '*')
  }

  window.dispatchEvent(new CustomEvent('ghe:moduleComplete', { detail: message }))
  return message
}
