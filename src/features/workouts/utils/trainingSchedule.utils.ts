import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { TimeView } from '@mui/x-date-pickers/models'
import {
  ALLOWED_TRAINING_HOURS,
  type AllowedTrainingHour,
} from '../constants/trainingSchedule.constants'
import type {
  SlotValidationFailureReason,
  SlotValidationInput,
  SlotValidationResult,
} from '../types/trainingDateTimePicker.types'
import type {
  SlotAvailabilityIndex,
  TrainingDateTimeIso,
  TrainingTimeSlot,
} from '../types/workout.types'

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Istanbul'

export interface TimeDisableContext {
  calendarDate: string
  availability: SlotAvailabilityIndex | null
  allowCurrentValue?: TrainingDateTimeIso
}

export function todayDateInputValue(): string {
  return dayjs().tz(TZ).format('YYYY-MM-DD')
}

export function formatDateInput(date: Date): string {
  return dayjs(date).tz(TZ).format('YYYY-MM-DD')
}

export function buildSlotDateTime(
  date: string,
  hour: AllowedTrainingHour,
): TrainingDateTimeIso {
  const hh = String(hour).padStart(2, '0')
  return `${date}T${hh}:00:00`
}

export function isAllowedHour(hour: number): hour is AllowedTrainingHour {
  return (ALLOWED_TRAINING_HOURS as readonly number[]).includes(hour)
}

export function formatTrainingDateTimeForDisplay(
  iso: TrainingDateTimeIso,
): string {
  const raw = iso.trim()
  if (!raw) return ''
  const datePart = raw.slice(0, 10)
  const timePart = raw.includes('T') ? raw.slice(11, 16) : ''
  if (!timePart) return datePart
  return `${datePart} ${timePart}`
}

export function parseHourFromDateTime(iso: TrainingDateTimeIso): number | null {
  if (!iso.includes('T')) return null
  const hour = Number.parseInt(iso.slice(11, 13), 10)
  return Number.isNaN(hour) ? null : hour
}

export function datePartFromDateTime(iso: TrainingDateTimeIso): string {
  return iso.slice(0, 10)
}

export function dayjsFromTrainingIso(iso: TrainingDateTimeIso): Dayjs {
  return dayjs.tz(iso, TZ)
}

export function trainingIsoFromDayjs(value: Dayjs): TrainingDateTimeIso {
  return value.tz(TZ).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm:ss')
}

export function snapToHourStart(value: Dayjs): Dayjs {
  return value.tz(TZ).minute(0).second(0).millisecond(0)
}

export function isPastSlot(dateStr: string, hour: number): boolean {
  const hh = String(hour).padStart(2, '0')
  const slot = dayjs.tz(`${dateStr}T${hh}:00:00`, TZ)
  return slot.isBefore(dayjs().tz(TZ))
}

export function isPastCalendarDay(date: Dayjs): boolean {
  return date
    .tz(TZ)
    .startOf('day')
    .isBefore(dayjs().tz(TZ).startOf('day'))
}

export function shouldDisableMinute(minute: number): boolean {
  return minute !== 0
}

export function shouldDisableHour(
  ctx: TimeDisableContext,
  hour: number,
): boolean {
  if (!isAllowedHour(hour)) {
    return true
  }

  const slotIso = buildSlotDateTime(
    ctx.calendarDate,
    hour as AllowedTrainingHour,
  )

  if (
    ctx.allowCurrentValue &&
    isSameTrainingDateTime(slotIso, ctx.allowCurrentValue)
  ) {
    return false
  }

  if (!ctx.availability) {
    return true
  }

  if (!ctx.availability.availableHourSet.has(hour)) {
    return true
  }

  if (isPastSlot(ctx.calendarDate, hour)) {
    return true
  }

  return false
}

export function createShouldDisableTime(ctx: TimeDisableContext) {
  return (timeValue: Dayjs, view: TimeView): boolean => {
    if (view === 'minutes') {
      return shouldDisableMinute(timeValue.minute())
    }
    if (view === 'hours') {
      return shouldDisableHour(ctx, timeValue.hour())
    }
    return false
  }
}

export function slotsToAvailabilityIndex(
  slots: TrainingTimeSlot[],
): SlotAvailabilityIndex {
  const availableHours: number[] = []
  for (const slot of slots) {
    const hour = parseHourFromDateTime(slot.dateTime)
    if (hour === null) continue
    if (slot.available && isAllowedHour(hour)) {
      availableHours.push(hour)
    }
  }
  return {
    availableHourSet: new Set(availableHours),
    hasAnyAvailable: availableHours.length > 0,
  }
}

export function formatAvailableHoursHelper(
  availability: SlotAvailabilityIndex | null,
): string | undefined {
  if (!availability?.hasAnyAvailable) {
    return undefined
  }
  const labels = [...availability.availableHourSet]
    .sort((a, b) => a - b)
    .map((h) => `${String(h).padStart(2, '0')}:00`)
  return `Seçilebilir saatler: ${labels.join(', ')}`
}

export function isSameTrainingDateTime(
  a: TrainingDateTimeIso,
  b: TrainingDateTimeIso,
): boolean {
  return (
    trainingIsoFromDayjs(dayjsFromTrainingIso(a)) ===
    trainingIsoFromDayjs(dayjsFromTrainingIso(b))
  )
}

export function isAvailabilityForDate(
  responseDate: string | undefined,
  calendarDate: string,
): boolean {
  return responseDate === calendarDate
}

export function isSlotsDataReady(
  calendarDate: string,
  slotsQueryDate: string | undefined,
  isLoading: boolean,
): boolean {
  return !isLoading && isAvailabilityForDate(slotsQueryDate, calendarDate)
}

export function validateSlotSelection(
  input: SlotValidationInput,
): SlotValidationResult {
  const hour = input.snapped.hour()
  if (!isAllowedHour(hour)) {
    return { ok: false, reason: 'INVALID_HOUR' }
  }

  const iso = trainingIsoFromDayjs(input.snapped)

  if (
    input.allowCurrentValue &&
    isSameTrainingDateTime(iso, input.allowCurrentValue)
  ) {
    return { ok: true, iso }
  }

  if (
    input.isLoading ||
    !isAvailabilityForDate(input.slotsQueryDate, input.calendarDate)
  ) {
    return { ok: false, reason: 'LOADING' }
  }

  const availability = slotsToAvailabilityIndex(input.slots ?? [])
  if (!availability.availableHourSet.has(hour)) {
    return { ok: false, reason: 'NOT_AVAILABLE' }
  }

  if (isPastSlot(input.calendarDate, hour)) {
    return { ok: false, reason: 'PAST' }
  }

  return { ok: true, iso }
}

export function validationMessageForReason(
  reason: SlotValidationFailureReason,
): string {
  switch (reason) {
    case 'LOADING':
      return 'Müsait saatler yükleniyor; saat seçimini birazdan tekrar deneyin.'
    case 'STALE':
      return 'Slot bilgisi güncelleniyor, lütfen saati yeniden seçin.'
    case 'NOT_AVAILABLE':
      return 'Bu saat müsait değil.'
    case 'INVALID_HOUR':
      return 'Bu saat diliminde antrenman oluşturulamaz.'
    case 'PAST':
      return 'Geçmiş bir saat seçilemez.'
    default:
      return 'Seçim geçersiz.'
  }
}
