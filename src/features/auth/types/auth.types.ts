export type UserRole = 'TRAINEE' | 'TRAINER' | 'ADMIN'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  dateOfBirth?: string
  address?: string
}

export interface RegisterResponse {
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expirationDate: string
}

export interface ChangePasswordRequest {
  username: string
  oldPassword: string
  newPassword: string
}

export interface AuthSession {
  accessToken: string
  tokenType: string
  expirationDate: string
  role: UserRole
  username: string
}

export interface ApiErrorShape {
  message: string
  status?: number
}
