import type { AuthSession } from '../types/auth.types'

const AUTH_STORAGE_KEY = 'gym-auth-session'
const AUTH_EVENT_NAME = 'gym-auth-changed'

const dispatchAuthChange = (): void => {
  if (typeof window === 'undefined') {
    return
  }
  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const saveSession = (session: AuthSession): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  dispatchAuthChange()
}

export const getSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export const clearSession = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  dispatchAuthChange()
}

export const subscribeAuthChange = (listener: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }
  window.addEventListener(AUTH_EVENT_NAME, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, listener)
    window.removeEventListener('storage', listener)
  }
}
