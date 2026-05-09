import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../features/auth/utils/authSession'

export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
