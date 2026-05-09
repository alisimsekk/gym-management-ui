import type { UserRole } from '../types/auth.types'

export const getRouteByRole = (role: UserRole): string => {
  if (role === 'ADMIN') {
    return '/admin'
  }
  return '/'
}
