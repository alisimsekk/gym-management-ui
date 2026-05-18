import {
  DEFAULT_TRAINING_DURATION_MINUTES,
  DURATION_OPTIONS,
  MAX_TRAINING_DURATION_MINUTES,
} from '../constants/trainingSchedule.constants'

interface TrainingDurationFieldProps {
  value: number
  onChange: (duration: number) => void
  disabled?: boolean
}

export function TrainingDurationField({
  value,
  onChange,
  disabled = false,
}: TrainingDurationFieldProps) {
  return (
    <label className="grid gap-1 text-sm text-slate-200">
      Süre (dakika, en fazla {MAX_TRAINING_DURATION_MINUTES})
      <select
        required
        disabled={disabled}
        value={value || DEFAULT_TRAINING_DURATION_MINUTES}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-50"
      >
        {DURATION_OPTIONS.map((minutes) => (
          <option key={minutes} value={minutes}>
            {minutes} dk
          </option>
        ))}
      </select>
    </label>
  )
}
