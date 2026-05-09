import { useQuery } from '@tanstack/react-query'
import { searchTrainings } from '../services/trainingService'

export const myTrainingsListKey = ['trainings', 'mine', 'list'] as const

/** Sunucu, oturumdaki kullaniciya gore traineeUsername veya trainerUsername filtresini uygular. */
export const useMyTrainingsQuery = () =>
  useQuery({
    queryKey: myTrainingsListKey,
    queryFn: () => searchTrainings({}),
  })
