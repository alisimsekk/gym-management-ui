import { request } from '../../../shared/api/httpClient'
import type {
  TrainingResponse,
  TrainingRequest,
  UpdateTrainingRequest,
  TrainingSearchRequest,
} from '../types/workout.types'

export const searchTrainings = (
  payload: TrainingSearchRequest,
): Promise<TrainingResponse[]> =>
  request<TrainingResponse[], TrainingSearchRequest>('/trainings/search', {
    method: 'POST',
    body: payload,
    auth: true,
  })

export const getTrainingById = (id: number): Promise<TrainingResponse> =>
  request<TrainingResponse>(`/trainings/${id}`, {
    method: 'GET',
    auth: true,
  })

export const createTraining = (
  payload: TrainingRequest,
): Promise<void> =>
  request<void, TrainingRequest>('/trainings', {
    method: 'POST',
    body: payload,
    auth: true,
  })

export const updateTraining = (
  id: number,
  payload: UpdateTrainingRequest,
): Promise<TrainingResponse> =>
  request<TrainingResponse, UpdateTrainingRequest>(`/trainings/${id}`, {
    method: 'PUT',
    body: payload,
    auth: true,
  })

export const deleteTraining = (id: number): Promise<void> =>
  request<void>(`/trainings/${id}`, {
    method: 'DELETE',
    auth: true,
  })

export const getAllTrainings = (): Promise<TrainingResponse[]> =>
  request<TrainingResponse[]>('/trainings', {
    method: 'GET',
    auth: true,
  })
