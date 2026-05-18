export const ALLOWED_TRAINING_HOURS = [9, 10, 11, 13, 14, 15, 16, 17, 18] as const
export type AllowedTrainingHour = (typeof ALLOWED_TRAINING_HOURS)[number]

export const MAX_TRAINING_DURATION_MINUTES = 45
export const DEFAULT_TRAINING_DURATION_MINUTES = 45

export const DURATION_OPTIONS = [15, 30, 45] as const
