import { useQuery } from '@tanstack/react-query'
import { getMyAdminProfile } from '../services/adminProfileService'

export const adminProfileKey = ['admin', 'me', 'profile'] as const

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: adminProfileKey,
    queryFn: getMyAdminProfile,
  })
}
