import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTraining } from '../services/trainingService'
import type { TrainingRequest } from '../types/workout.types'

export const useCreateTrainingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TrainingRequest) => createTraining(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })
}
