import { Link } from 'react-router-dom'
import {
  TRAINER_WORKLOAD_EMPTY_TRAINER,
  trainerWorkloadEmptyAdminMessage,
} from '../constants/trainerWorkloadMessages'

interface TrainerWorkloadEmptyStateProps {
  variant: 'trainer' | 'admin'
  trainerUsername?: string
}

export function TrainerWorkloadEmptyState({
  variant,
  trainerUsername,
}: TrainerWorkloadEmptyStateProps) {
  const message =
    variant === 'admin' && trainerUsername
      ? trainerWorkloadEmptyAdminMessage(trainerUsername)
      : TRAINER_WORKLOAD_EMPTY_TRAINER

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4">
      <p className="text-sm leading-relaxed text-slate-300">{message}</p>
      {variant === 'trainer' && (
        <Link
          to="/profil/antrenmanlar"
          className="mt-3 inline-block text-xs font-medium text-cyan-300 hover:text-cyan-100"
        >
          Antrenmanlarım →
        </Link>
      )}
    </div>
  )
}
