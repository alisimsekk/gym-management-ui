export type UserType = 'TRAINEE' | 'TRAINER' | 'ADMIN'
export type ActionType = 'ADD' | 'DELETE'

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expirationDate: string
}

export interface ChangePasswordRequest {
  username: string
  oldPassword: string
  newPassword: string
}

export interface UserRegistrationResponse {
  username: string
  password: string
}

export interface TraineeCreateRequest {
  firstName: string
  lastName: string
  dateOfBirth?: string
  address?: string
}

export interface TrainerCreateRequest {
  firstName: string
  lastName: string
  specializationId: number
}

export interface AdminCreateRequest {
  firstName: string
  lastName: string
}

export interface UserSearchRequest {
  firstName?: string
  lastName?: string
  username?: string
  userType?: UserType
}

export interface TrainerBasicInfoDto {
  username: string
  firstName: string
  lastName: string
  specialization: string
}

export interface TraineeBasicInfoDto {
  username: string
  firstName: string
  lastName: string
}

export interface TraineeProfileResponse {
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  isActive: boolean
  trainers: TrainerBasicInfoDto[]
}

export interface TrainerProfileResponse {
  username: string
  firstName: string
  lastName: string
  specialization: string
  isActive: boolean
  trainees: TraineeBasicInfoDto[]
}

export interface UpdateTraineeRequest {
  firstName: string
  lastName: string
  dateOfBirth?: string
  address?: string
  isActive: boolean
}

export interface UpdateTrainerRequest {
  firstName: string
  lastName: string
  specializationId: number
  isActive: boolean
}

export interface UpdateTrainerListRequest {
  trainerUsernames: string[]
}

export interface TrainingRequest {
  traineeUsername: string
  trainerUsername: string
  trainingName: string
  trainingDate: string
  trainingDuration: number
  trainingTypeId: number
}

export interface UpdateTrainingRequest {
  traineeUsername: string
  trainerUsername: string
}

export interface TrainingSearchRequest {
  traineeUsername?: string
  periodFrom?: string
  periodTo?: string
  trainerName?: string
  trainingTypeName?: string
  trainerUsername?: string
  traineeName?: string
}

export interface TrainingResponse {
  id: number
  trainingName: string
  trainingDate: string
  trainingType: string
  duration: number
  trainerName: string
  trainerUsername: string
  traineeName: string
  traineeUsername: string
}

export interface TrainingTypeRequest {
  trainingName: string
}

export interface TrainingTypeSearchRequest {
  trainingName?: string
}

export interface TrainingTypeResponse {
  id: number
  trainingTypeName: string
}

export interface MonthlyWorkload {
  month: string
  totalTrainingDuration: number
}

export interface YearlyWorkload {
  year: number
  monthlyWorkloads: MonthlyWorkload[]
}

export interface TrainerWorkloadSummary {
  trainerUsername: string
  trainerFirstName: string
  trainerLastName: string
  active: boolean
  yearlyWorkloads: YearlyWorkload[]
}
