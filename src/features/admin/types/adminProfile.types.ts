export interface AdminProfileResponse {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
}

export interface UpdateAdminProfileRequest {
  firstName: string
  lastName: string
  email: string
}
