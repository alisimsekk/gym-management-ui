import type { AuthSession, LoginResponse, UserRole } from '../types/auth.types'
import { getSession } from './authStorage'

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) {
      return null
    }
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payloadJson) as Record<string, unknown>
  } catch {
    return null
  }
}

const normalizeRole = (value: unknown): UserRole | null => {
  if (typeof value === 'string') {
    if (value.includes('ADMIN')) return 'ADMIN'
    if (value.includes('TRAINER')) return 'TRAINER'
    if (value.includes('TRAINEE')) return 'TRAINEE'
  }
  if (Array.isArray(value)) {
    const joined = value.map(String).join(',')
    if (joined.includes('ADMIN')) return 'ADMIN'
    if (joined.includes('TRAINER')) return 'TRAINER'
    if (joined.includes('TRAINEE')) return 'TRAINEE'
  }
  return null
}

export const buildSessionFromLogin = (response: LoginResponse): AuthSession => {
  const payload = parseJwtPayload(response.accessToken)
  const role =
    normalizeRole(payload?.role ?? payload?.roles) ??
    normalizeRole(payload?.authorities) ??
    'TRAINEE'
  const username =
    typeof payload?.sub === 'string'
      ? payload.sub
      : typeof payload?.username === 'string'
        ? payload.username
        : ''

  return {
    accessToken: response.accessToken,
    tokenType: response.tokenType,
    expirationDate: response.expirationDate,
    role,
    username,
  }
}

/** JWT icindeki authorities / sub ile rol ve kullanici adini oturumla esitler (eski localStorage kayitlari icin). */
export const syncSessionFromAccessToken = (session: AuthSession): AuthSession => {
  const payload = parseJwtPayload(session.accessToken)
  const role =
    normalizeRole(payload?.role ?? payload?.roles) ??
    normalizeRole(payload?.authorities) ??
    'TRAINEE'
  const username =
    typeof payload?.sub === 'string'
      ? payload.sub
      : typeof payload?.username === 'string'
        ? payload.username
        : session.username

  if (role === session.role && username === session.username) {
    return session
  }
  return { ...session, role, username }
}

export const isAuthenticated = (): boolean => {
  const session = getSession()
  if (!session) return false

  const expiration = new Date(session.expirationDate).getTime()
  if (Number.isNaN(expiration)) return true
  return expiration > Date.now()
}
