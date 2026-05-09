import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTraining } from '../services/trainingService'

export const useDeleteTrainingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTraining(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings', 'mine'] })
    },
  })
}
