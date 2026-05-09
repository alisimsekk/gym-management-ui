import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTrainee } from '../services/profileService'
import { traineeProfileKey } from './useTraineeProfile'
import type { UpdateTraineeRequest } from '../types/profile.types'

interface UpdateTraineeArgs {
  id: number
  username: string
  payload: UpdateTraineeRequest
}

export const useUpdateTrainee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTraineeArgs) => updateTrainee(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: traineeProfileKey(variables.username),
      })
    },
  })
}
