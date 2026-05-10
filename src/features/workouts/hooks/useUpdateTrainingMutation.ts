import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTraining } from '../services/trainingService'
import type { UpdateTrainingRequest } from '../types/workout.types'

interface Args {
  id: number
  payload: UpdateTrainingRequest
}

export const useUpdateTrainingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: Args) => updateTraining(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })
}
