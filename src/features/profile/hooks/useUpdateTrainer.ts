import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTrainer } from '../services/profileService'
import { trainerProfileKey } from './useTrainerProfile'
import type { UpdateTrainerRequest } from '../types/profile.types'

interface UpdateTrainerArgs {
  id: number
  username: string
  payload: UpdateTrainerRequest
}

export const useUpdateTrainer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTrainerArgs) => updateTrainer(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: trainerProfileKey(variables.username),
      })
    },
  })
}
