import { request } from '../../../shared/api/httpClient'
import type { RegisterRequest, RegisterResponse } from '../../auth/types/auth.types'

export interface AdminCreateAccountRequest {
  firstName: string
  lastName: string
  email: string
}

export interface TrainerCreateRequest {
  firstName: string
  lastName: string
  email: string
  specializationId: number
}

export const createTraineeByAdmin = (
  body: RegisterRequest,
): Promise<RegisterResponse> =>
  request<RegisterResponse, RegisterRequest>('/admin/users/trainee', {
    method: 'POST',
    body,
    auth: true,
  })

export const createTrainerByAdmin = (
  body: TrainerCreateRequest,
): Promise<RegisterResponse> =>
  request<RegisterResponse, TrainerCreateRequest>('/admin/users/trainer', {
    method: 'POST',
    body,
    auth: true,
  })

export const createAdminByAdmin = (
  body: AdminCreateAccountRequest,
): Promise<RegisterResponse> =>
  request<RegisterResponse, AdminCreateAccountRequest>(
    '/admin/users/admin',
    {
      method: 'POST',
      body,
      auth: true,
    },
  )
