import { request } from '../../../shared/api/httpClient'
import type { TrainingTypeResponse } from '../types/workout.types'

export const getTrainingTypes = (): Promise<TrainingTypeResponse[]> =>
  request<TrainingTypeResponse[]>('/training-types', {
    method: 'GET',
    auth: true,
  })
