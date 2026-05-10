import { Navigate, Outlet } from 'react-router-dom'
import { getSession } from '../features/auth/utils/authStorage'
import {
  isAuthenticated,
  syncSessionFromAccessToken,
} from '../features/auth/utils/authSession'

export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}

/** Yalnizca ADMIN rolu JWT oturumu ile /admin alt rotalarina erisim. */
export function AdminRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />
  }
  const raw = getSession()
  if (!raw) {
    return <Navigate to="/auth/login" replace />
  }
  const session = syncSessionFromAccessToken(raw)
  if (session.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
