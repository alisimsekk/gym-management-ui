import type { AuthSession, LoginResponse, UserRole } from '../types/auth.types'
import { getSession } from './authStorage'

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) {
      return null
    }

    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    
    const binaryString = atob(base64)

    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const payloadJson = new TextDecoder('utf-8').decode(bytes)

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

const normalizeExpirationDate = (
  value: unknown,
  accessToken: string,
): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value > 1_000_000_000_000 ? value : value * 1000
    return new Date(ms).toISOString()
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    ).toISOString()
  }

  if (value && typeof value === 'object') {
    const record = value as {
      year?: number
      monthValue?: number
      dayOfMonth?: number
      hour?: number
      minute?: number
      second?: number
    }
    if (typeof record.year === 'number') {
      return new Date(
        record.year,
        (record.monthValue ?? 1) - 1,
        record.dayOfMonth ?? 1,
        record.hour ?? 0,
        record.minute ?? 0,
        record.second ?? 0,
      ).toISOString()
    }
  }

  const payload = parseJwtPayload(accessToken)
  if (payload && typeof payload.exp === 'number') {
    return new Date(payload.exp * 1000).toISOString()
  }

  return new Date(Date.now() + 3_600_000).toISOString()
}

const getExpirationTime = (session: {
  accessToken: string
  expirationDate: string
}): number | null => {
  const payload = parseJwtPayload(session.accessToken)
  if (payload && typeof payload.exp === 'number') {
    return payload.exp * 1000
  }

  const parsed = new Date(session.expirationDate).getTime()
  if (!Number.isNaN(parsed)) {
    return parsed
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
    expirationDate: normalizeExpirationDate(
      response.expirationDate,
      response.accessToken,
    ),
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

  const expiration = getExpirationTime(session)
  if (expiration === null) return true
  return expiration > Date.now()
}
