import type { BackendErrorPayload } from './types/backendError.types'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function parseBackendErrorPayload(raw: unknown): BackendErrorPayload | null {
  if (!isRecord(raw)) return null

  const validationRaw = raw.validationErrors
  let validationErrors: Record<string, string> | null = null
  if (isRecord(validationRaw)) {
    const entries = Object.entries(validationRaw).filter(
      (e): e is [string, string] => typeof e[1] === 'string',
    )
    if (entries.length > 0) {
      validationErrors = Object.fromEntries(entries)
    }
  }

  return {
    status: typeof raw.status === 'string' ? raw.status : undefined,
    httpStatus: typeof raw.httpStatus === 'number' ? raw.httpStatus : undefined,
    message:
      typeof raw.message === 'string'
        ? raw.message
        : raw.message === null
          ? null
          : undefined,
    errorCode:
      raw.errorCode === null
        ? null
        : typeof raw.errorCode === 'string'
          ? raw.errorCode
          : undefined,
    validationErrors,
  }
}

/** Sunucu message + validationErrors birleşimi (henüz yerelleştirme yok) */
export function primaryMessageFromPayload(p: BackendErrorPayload): string {
  const trimmed = (p.message ?? '').trim()
  if (trimmed.length > 0) return trimmed
  const vals = Object.values(p.validationErrors ?? {})
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
  if (vals.length > 0) return vals.join('\n')
  return ''
}
