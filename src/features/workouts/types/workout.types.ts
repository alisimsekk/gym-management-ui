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

export interface TrainingRequest {
  traineeUsername: string
  trainerUsername: string
  trainingName: string
  trainingDate: string
  trainingDuration: number
  trainingTypeId: number
}

export interface UpdateTrainingRequest {
  trainingName: string
  traineeUsername: string
  trainerUsername: string
  trainingTypeId: number
  trainingDate: string
  trainingDuration: number
}

export interface TrainingSearchRequest {
  traineeUsername?: string
  trainerUsername?: string
  trainerName?: string
  traineeName?: string
  trainingTypeName?: string
  periodFrom?: string
  periodTo?: string
}

export interface TrainingTypeResponse {
  id: number
  trainingTypeName: string
}
