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
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth?: string
  address?: string
  isActive: boolean
  trainers: TrainerBasicInfoDto[]
}

export interface TrainerProfileResponse {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  specializationId?: number
  isActive: boolean
  trainees: TraineeBasicInfoDto[]
}

export interface UpdateTraineeRequest {
  firstName: string
  lastName: string
  email: string
  dateOfBirth?: string
  address?: string
  isActive: boolean
}

export interface UpdateTrainerRequest {
  firstName: string
  lastName: string
  email: string
  specializationId: number
  isActive: boolean
}

export interface UpdateTrainerListRequest {
  trainerUsernames: string[]
}

export type TraineeUpdateResponse = TraineeProfileResponse
export type TrainerUpdateResponse = TrainerProfileResponse
