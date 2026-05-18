import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Dayjs } from 'dayjs'
import { useAvailableTrainingSlotsQuery } from './useAvailableTrainingSlotsQuery'
import {
  createShouldDisableTime,
  datePartFromDateTime,
  dayjsFromTrainingIso,
  formatAvailableHoursHelper,
  isSlotsDataReady,
  slotsToAvailabilityIndex,
  snapToHourStart,
  todayDateInputValue,
  validateSlotSelection,
  validationMessageForReason,
  type TimeDisableContext,
} from '../utils/trainingSchedule.utils'
import type { TrainingDateTimeIso } from '../types/workout.types'
interface UseTrainingDateTimePickerStateParams {
  trainerUsername: string
  traineeUsername: string
  value: TrainingDateTimeIso | null
  onChange: (iso: TrainingDateTimeIso | null) => void
  disabled?: boolean
  excludeTrainingId?: number
  allowCurrentValue?: TrainingDateTimeIso
}

export function useTrainingDateTimePickerState({
  trainerUsername,
  traineeUsername,
  value,
  onChange,
  disabled = false,
  excludeTrainingId,
  allowCurrentValue,
}: UseTrainingDateTimePickerStateParams) {
  const participantsReady =
    Boolean(trainerUsername.trim()) && Boolean(traineeUsername.trim())

  const [calendarDate, setCalendarDate] = useState(() =>
    value ? datePartFromDateTime(value) : todayDateInputValue(),
  )

  const [draftDateTime, setDraftDateTime] = useState<Dayjs | null>(() =>
    value ? dayjsFromTrainingIso(value) : null,
  )

  const [selectionHint, setSelectionHint] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      setDraftDateTime(dayjsFromTrainingIso(value))
      setCalendarDate(datePartFromDateTime(value))
      setSelectionHint(null)
    }
  }, [value])

  const slotsQuery = useAvailableTrainingSlotsQuery(
    participantsReady && calendarDate
      ? {
          trainerUsername,
          traineeUsername,
          date: calendarDate,
          excludeTrainingId,
        }
      : null,
  )

  const slotsReady = isSlotsDataReady(
    calendarDate,
    slotsQuery.data?.date,
    slotsQuery.isLoading,
  )

  const availability = useMemo(() => {
    if (!slotsReady || !slotsQuery.data) {
      return null
    }
    return slotsToAvailabilityIndex(slotsQuery.data.slots)
  }, [slotsReady, slotsQuery.data])

  const disableContext: TimeDisableContext = useMemo(
    () => ({
      calendarDate,
      availability,
      allowCurrentValue,
    }),
    [calendarDate, availability, allowCurrentValue],
  )

  const shouldDisableTime = useMemo(
    () => createShouldDisableTime(disableContext),
    [disableContext],
  )

  const tryCommit = useCallback(
    (
      snapped: Dayjs,
      dateStr: string,
    ): boolean => {
      const result = validateSlotSelection({
        calendarDate: dateStr,
        snapped,
        slots: slotsQuery.data?.slots,
        slotsQueryDate: slotsQuery.data?.date,
        isLoading: slotsQuery.isLoading,
        allowCurrentValue,
      })

      if (result.ok) {
        setSelectionHint(null)
        onChange(result.iso)
        return true
      }

      if (result.reason !== 'LOADING') {
        setSelectionHint(validationMessageForReason(result.reason))
      }
      return false
    },
    [
      allowCurrentValue,
      onChange,
      slotsQuery.data?.date,
      slotsQuery.data?.slots,
      slotsQuery.isLoading,
    ],
  )

  const handleChange = useCallback(
    (next: Dayjs | null) => {
      if (!next) {
        setDraftDateTime(null)
        setSelectionHint(null)
        onChange(null)
        return
      }

      const dateStr = next.format('YYYY-MM-DD')
      const snapped = snapToHourStart(next)

      setDraftDateTime(snapped)

      if (dateStr !== calendarDate) {
        setCalendarDate(dateStr)
        setSelectionHint(null)
        onChange(null)
        return
      }

      tryCommit(snapped, dateStr)
    },
    [calendarDate, onChange, tryCommit],
  )

  useEffect(() => {
    if (!draftDateTime || !slotsReady) {
      return
    }

    const dateStr = draftDateTime.format('YYYY-MM-DD')
    if (dateStr !== calendarDate) {
      return
    }

    const snapped = snapToHourStart(draftDateTime)
    const result = validateSlotSelection({
      calendarDate: dateStr,
      snapped,
      slots: slotsQuery.data?.slots,
      slotsQueryDate: slotsQuery.data?.date,
      isLoading: false,
      allowCurrentValue,
    })

    if (result.ok && result.iso !== value) {
      setSelectionHint(null)
      onChange(result.iso)
    }
  }, [
    allowCurrentValue,
    calendarDate,
    draftDateTime,
    onChange,
    slotsQuery.data?.date,
    slotsQuery.data?.slots,
    slotsReady,
    value,
  ])

  const fieldDisabled = disabled || !participantsReady

  const helperText = slotsQuery.isLoading
    ? 'Müsait saatler yükleniyor…'
    : selectionHint ?? formatAvailableHoursHelper(availability)

  return {
    draftDateTime,
    handleChange,
    shouldDisableTime,
    fieldDisabled,
    helperText,
    participantsReady,
    slotsQuery,
    availability,
  }
}
