import { useQuery } from '@tanstack/react-query'
import { getTrainingTypes } from '../services/trainingTypeService'

export const trainingTypesKey = ['training-types'] as const

export const useTrainingTypesQuery = () =>
  useQuery({
    queryKey: trainingTypesKey,
    queryFn: getTrainingTypes,
  })
