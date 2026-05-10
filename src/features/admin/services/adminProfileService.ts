import { request } from '../../../shared/api/httpClient'
import type {
  AdminProfileResponse,
  UpdateAdminProfileRequest,
} from '../types/adminProfile.types'

export const getMyAdminProfile = (): Promise<AdminProfileResponse> =>
  request<AdminProfileResponse>('/admin/users/me', {
    method: 'GET',
    auth: true,
  })

export const updateMyAdminProfile = (
  body: UpdateAdminProfileRequest,
): Promise<AdminProfileResponse> =>
  request<AdminProfileResponse, UpdateAdminProfileRequest>('/admin/users/me', {
    method: 'PUT',
    body,
    auth: true,
  })
