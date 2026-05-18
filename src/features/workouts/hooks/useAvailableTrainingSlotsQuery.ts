import { useQuery } from '@tanstack/react-query'
import { getAvailableTrainingSlots } from '../services/trainingService'
import type { AvailableTrainingSlotsParams } from '../types/workout.types'

export function useAvailableTrainingSlotsQuery(
  params: AvailableTrainingSlotsParams | null,
) {
  return useQuery({
    queryKey: ['trainings', 'available-slots', params],
    queryFn: () => getAvailableTrainingSlots(params!),
    enabled:
      Boolean(params?.trainerUsername) &&
      Boolean(params?.traineeUsername) &&
      Boolean(params?.date),
  })
}
