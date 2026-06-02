import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { TRAINER_WORKLOAD_ERROR_FALLBACK } from '../constants/trainerWorkloadMessages'

interface TrainerWorkloadErrorStateProps {
  error: unknown
}

export function TrainerWorkloadErrorState({ error }: TrainerWorkloadErrorStateProps) {
  const message = resolveUserFacingApiErrorMessage(
    error,
    TRAINER_WORKLOAD_ERROR_FALLBACK,
  )

  return (
    <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
      {message}
    </p>
  )
}
