import { ApiError } from './apiError'
import { getApiBaseUrl } from './apiConfig'
import { parseBackendErrorPayload, primaryMessageFromPayload } from './parseBackendError'

const API_BASE_URL = getApiBaseUrl()
const AUTH_STORAGE_KEY = 'gym-auth-session'

const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as { accessToken?: string }
    return parsed.accessToken ?? null
  } catch {
    return null
  }
}

export const request = async <TResponse, TBody = undefined>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: TBody
    auth?: boolean
  },
): Promise<TResponse> => {
  const method = options?.method ?? 'GET'
  const token = options?.auth ? getAuthToken() : null
  const url = `${API_BASE_URL}${path}`

  if (import.meta.env.DEV) {
    console.info(`[api] ${method} ${url}`)
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const fallback = 'Beklenmeyen bir hata oluştu.'
    try {
      const body: unknown = await response.json()
      const parsed = parseBackendErrorPayload(body)
      if (parsed) {
        const primary = primaryMessageFromPayload(parsed).trim()
        throw new ApiError(primary || fallback, response.status, {
          errorCode: parsed.errorCode ?? null,
          validationErrors: parsed.validationErrors ?? null,
        })
      }
    } catch (e) {
      if (e instanceof ApiError) throw e
    }
    throw new ApiError(response.statusText?.trim() || fallback, response.status)
  }

  if (import.meta.env.DEV) {
    console.info(`[api] ${method} ${url} -> ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const raw = await response.text()
  if (!raw.trim()) {
    return undefined as TResponse
  }

  return JSON.parse(raw) as TResponse
}
