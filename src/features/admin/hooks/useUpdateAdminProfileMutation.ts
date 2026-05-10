import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMyAdminProfile } from '../services/adminProfileService'
import { adminProfileKey } from './useAdminProfileQuery'

export function useUpdateAdminProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMyAdminProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProfileKey })
    },
  })
}
