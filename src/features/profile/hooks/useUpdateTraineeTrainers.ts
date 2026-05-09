import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTraineeTrainerList } from '../services/profileService'
import { traineeProfileKey } from './useTraineeProfile'
import type { UpdateTrainerListRequest } from '../types/profile.types'

interface Args {
  username: string
  payload: UpdateTrainerListRequest
}

export const useUpdateTraineeTrainers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ username, payload }: Args) =>
      updateTraineeTrainerList(username, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: traineeProfileKey(variables.username),
      })
    },
  })
}
