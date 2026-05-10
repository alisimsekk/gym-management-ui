import { request } from '../../../shared/api/httpClient'
import type {
  TraineeProfileResponse,
  TraineeUpdateResponse,
  TrainerBasicInfoDto,
  TrainerProfileResponse,
  TrainerUpdateResponse,
  UpdateTraineeRequest,
  UpdateTrainerListRequest,
  UpdateTrainerRequest,
} from '../types/profile.types'

export const getTraineeProfile = (
  username: string,
): Promise<TraineeProfileResponse> =>
  request<TraineeProfileResponse>(`/trainees/${encodeURIComponent(username)}`, {
    method: 'GET',
    auth: true,
  })

export const getTrainerProfile = (
  username: string,
): Promise<TrainerProfileResponse> =>
  request<TrainerProfileResponse>(`/trainers/${encodeURIComponent(username)}`, {
    method: 'GET',
    auth: true,
  })

export const updateTrainee = (
  id: number,
  payload: UpdateTraineeRequest,
): Promise<TraineeUpdateResponse> =>
  request<TraineeUpdateResponse, UpdateTraineeRequest>(`/trainees/${id}`, {
    method: 'PUT',
    body: payload,
    auth: true,
  })

export const updateTrainer = (
  id: number,
  payload: UpdateTrainerRequest,
): Promise<TrainerUpdateResponse> =>
  request<TrainerUpdateResponse, UpdateTrainerRequest>(`/trainers/${id}`, {
    method: 'PUT',
    body: payload,
    auth: true,
  })

export const updateTraineeTrainerList = (
  username: string,
  payload: UpdateTrainerListRequest,
): Promise<TrainerBasicInfoDto[]> =>
  request<TrainerBasicInfoDto[], UpdateTrainerListRequest>(
    `/trainees/${encodeURIComponent(username)}/update-trainers`,
    {
      method: 'PUT',
      body: payload,
      auth: true,
    },
  )

export const deleteTrainerByUsername = (username: string): Promise<void> =>
  request<void>(`/trainers/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    auth: true,
  })

export const deleteTraineeByUsername = (username: string): Promise<void> =>
  request<void>(`/trainees/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    auth: true,
  })

export const toggleTrainerActiveStatus = (id: number): Promise<void> =>
  request<void>(`/trainers/${id}/status`, {
    method: 'PATCH',
    auth: true,
  })

export const toggleTraineeActiveStatus = (id: number): Promise<void> =>
  request<void>(`/trainees/${id}/status`, {
    method: 'PATCH',
    auth: true,
  })
