import { useQuery } from '@tanstack/react-query'
import { getAllTrainings } from '../../workouts/services/trainingService'

export const adminAllTrainingsKey = ['trainings', 'admin', 'all'] as const

export function useAdminAllTrainingsQuery() {
  return useQuery({
    queryKey: adminAllTrainingsKey,
    queryFn: () => getAllTrainings(),
  })
}
