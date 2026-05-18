export type TrainingDateTimeIso = string

export type SlotUnavailabilityReason =
    | 'PAST'
    | 'TRAINER_BUSY'
    | 'TRAINEE_BUSY'
    | 'NOT_ALLOWED_HOUR'

export interface TrainingResponse {
    id: number
    trainingName: string
    trainingDateTime: TrainingDateTimeIso
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
    trainingDateTime: TrainingDateTimeIso
    trainingDuration: number
    trainingTypeId: number
}

export interface UpdateTrainingRequest {
    trainingName: string
    traineeUsername: string
    trainerUsername: string
    trainingTypeId: number
    trainingDateTime: TrainingDateTimeIso
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

export interface TrainingTimeSlot {
    label: string
    dateTime: TrainingDateTimeIso
    available: boolean
    reason?: SlotUnavailabilityReason
}

export interface AvailableTrainingSlotsResponse {
    date: string
    slots: TrainingTimeSlot[]
}

export interface AvailableTrainingSlotsParams {
    trainerUsername: string
    traineeUsername: string
    date: string
    excludeTrainingId?: number
}

export interface SlotAvailabilityIndex {
    availableHourSet: ReadonlySet<number>
    hasAnyAvailable: boolean
}

export interface TrainingTypeResponse {
    id: number
    trainingTypeName: string
}

export interface TrainingTypeRequest {
    trainingName: string
}

export interface TrainingTypeSearchRequest {
    trainingName?: string
}
