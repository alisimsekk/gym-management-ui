import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { AuthSession, UserRole } from '../types/auth.types'
import {
  clearSession,
  getSession,
  saveSession,
  subscribeAuthChange,
} from '../utils/authStorage'
import {
  isAuthenticated as checkIsAuthenticated,
  syncSessionFromAccessToken,
} from '../utils/authSession'

interface UseAuthResult {
  session: AuthSession | null
  isAuthenticated: boolean
  role: UserRole | null
  username: string | null
  logout: (redirectTo?: string) => void
}

export const useAuth = (): UseAuthResult => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [session, setSession] = useState<AuthSession | null>(() => {
    const s = getSession()
    if (!s) return null
    const synced = syncSessionFromAccessToken(s)
    if (synced !== s) {
      saveSession(synced)
    }
    return synced
  })

  useEffect(() => {
    const sync = () => {
      const s = getSession()
      if (!s) {
        setSession(null)
        return
      }
      const synced = syncSessionFromAccessToken(s)
      if (synced !== s) {
        saveSession(synced)
      }
      setSession(synced)
    }
    return subscribeAuthChange(sync)
  }, [])

  const logout = useCallback(
    (redirectTo: string = '/') => {
      clearSession()
      queryClient.clear()
      navigate(redirectTo, { replace: true })
    },
    [navigate, queryClient],
  )

  return {
    session,
    isAuthenticated: session !== null && checkIsAuthenticated(),
    role: session?.role ?? null,
    username: session?.username ?? null,
    logout,
  }
}
