import type { Dayjs } from 'dayjs'
import type { TrainingDateTimeIso, TrainingTimeSlot } from './workout.types'

export type SlotValidationFailureReason =
  | 'LOADING'
  | 'STALE'
  | 'NOT_AVAILABLE'
  | 'INVALID_HOUR'
  | 'PAST'

export type SlotValidationResult =
  | { ok: true; iso: TrainingDateTimeIso }
  | { ok: false; reason: SlotValidationFailureReason }

export interface SlotValidationInput {
  calendarDate: string
  snapped: Dayjs
  slots: TrainingTimeSlot[] | undefined
  slotsQueryDate: string | undefined
  isLoading: boolean
  allowCurrentValue?: TrainingDateTimeIso
}
