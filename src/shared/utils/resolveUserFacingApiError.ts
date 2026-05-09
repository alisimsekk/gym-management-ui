import { ApiError } from '../api/apiError'
import { localizeApiMessage } from './localizeApiMessage'

const DEFAULT_FALLBACK = 'Beklenmeyen bir hata oluştu.'

function localizeMultiline(text: string): string {
  return text
    .split('\n')
    .map((line) => localizeApiMessage(line.trim()))
    .filter((line) => line.length > 0)
    .join('\n')
}

/**
 * API / mutation hatalarını kullanıcıya göstermek için tek giriş noktası.
 */
export function resolveUserFacingApiErrorMessage(
  err: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (err instanceof ApiError) {
    const base = err.message.trim()
    if (base.length > 0) return localizeMultiline(base)
    const fromMap = Object.values(err.validationErrors ?? {})
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
    if (fromMap.length > 0) return localizeMultiline(fromMap.join('\n'))
    return fallback
  }
  if (err instanceof Error && err.message.trim().length > 0) {
    return localizeMultiline(err.message.trim())
  }
  return fallback
}
