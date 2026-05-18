import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { isPastCalendarDay } from '../utils/trainingSchedule.utils'
import type { TrainingDateTimeIso } from '../types/workout.types'
import { TrainingScheduleLocalizationProvider } from '../providers/TrainingScheduleLocalizationProvider'
import { useTrainingDateTimePickerState } from '../hooks/useTrainingDateTimePickerState'

interface TrainingDateTimePickerFieldProps {
  trainerUsername: string
  traineeUsername: string
  value: TrainingDateTimeIso | null
  onChange: (iso: TrainingDateTimeIso | null) => void
  disabled?: boolean
  excludeTrainingId?: number
  allowCurrentValue?: TrainingDateTimeIso
}

export function TrainingDateTimePickerField({
  trainerUsername,
  traineeUsername,
  value,
  onChange,
  disabled = false,
  excludeTrainingId,
  allowCurrentValue,
}: TrainingDateTimePickerFieldProps) {
  const {
    draftDateTime,
    handleChange,
    shouldDisableTime,
    fieldDisabled,
    helperText,
    participantsReady,
    slotsQuery,
    availability,
  } = useTrainingDateTimePickerState({
    trainerUsername,
    traineeUsername,
    value,
    onChange,
    disabled,
    excludeTrainingId,
    allowCurrentValue,
  })

  return (
    <TrainingScheduleLocalizationProvider>
      <div className="grid gap-2">
        <DateTimePicker
          label="Tarih ve saat"
          value={draftDateTime}
          onChange={handleChange}
          disabled={fieldDisabled}
          ampm={false}
          format="DD.MM.YYYY HH:mm"
          views={['year', 'month', 'day', 'hours', 'minutes']}
          timeSteps={{ hours: 1, minutes: 60 }}
          shouldDisableDate={isPastCalendarDay}
          shouldDisableTime={shouldDisableTime}
          closeOnSelect={false}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
              required: true,
              helperText,
              className: 'training-datetime-picker-field',
            },
          }}
        />

        {!participantsReady && (
          <p className="text-xs text-slate-500">
            Tarih ve saat seçmek için önce katılımcıları seçin.
          </p>
        )}

        {participantsReady && slotsQuery.isError && (
          <p className="text-sm text-rose-300">
            Müsait saatler alınamadı. Lütfen tekrar deneyin.
          </p>
        )}

        {participantsReady &&
          availability &&
          !availability.hasAnyAvailable &&
          !slotsQuery.isLoading && (
            <p className="text-xs text-amber-200/90">
              Bu tarihte müsait saat yok. Başka bir tarih seçin.
            </p>
          )}
      </div>
    </TrainingScheduleLocalizationProvider>
  )
}
