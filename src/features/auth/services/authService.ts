import { request } from '../../../shared/api/httpClient'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth.types'

export const registerTrainee = (payload: RegisterRequest): Promise<RegisterResponse> =>
  request<RegisterResponse, RegisterRequest>('/auth/register', {
    method: 'POST',
    body: payload,
  })

export const login = (payload: LoginRequest): Promise<LoginResponse> =>
  request<LoginResponse, LoginRequest>('/auth/login', {
    method: 'POST',
    body: payload,
  })

export const changePassword = (payload: ChangePasswordRequest): Promise<void> =>
  request<void, ChangePasswordRequest>('/auth/change-password', {
    method: 'PUT',
    body: payload,
    auth: true,
  })
