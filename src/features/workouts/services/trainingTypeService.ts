import { request } from '../../../shared/api/httpClient'
import type {
  TrainingTypeRequest,
  TrainingTypeResponse,
  TrainingTypeSearchRequest,
} from '../types/workout.types'

export const getTrainingTypes = (): Promise<TrainingTypeResponse[]> =>
  request<TrainingTypeResponse[]>('/training-types', {
    method: 'GET',
    auth: true,
  })

export const searchTrainingTypes = (
  body: TrainingTypeSearchRequest,
): Promise<TrainingTypeResponse[]> =>
  request<TrainingTypeResponse[], TrainingTypeSearchRequest>(
    '/training-types/search',
    {
      method: 'POST',
      body,
      auth: true,
    },
  )

export const createTrainingType = (
  body: TrainingTypeRequest,
): Promise<TrainingTypeResponse> =>
  request<TrainingTypeResponse, TrainingTypeRequest>('/training-types', {
    method: 'POST',
    body,
    auth: true,
  })

export const updateTrainingType = (
  id: number,
  body: TrainingTypeRequest,
): Promise<TrainingTypeResponse> =>
  request<TrainingTypeResponse, TrainingTypeRequest>(`/training-types/${id}`, {
    method: 'PUT',
    body,
    auth: true,
  })

export const deleteTrainingType = (id: number): Promise<void> =>
  request<void>(`/training-types/${id}`, {
    method: 'DELETE',
    auth: true,
  })
