import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { useTrainerWorkload } from '../hooks/useTrainerWorkload'
import { TrainerWorkloadPanel } from '../components/TrainerWorkloadPanel'

export function TrainerWorkloadPage() {
  const { role, username, isAuthenticated } = useAuth()
  const query = useTrainerWorkload(
    role === 'TRAINER' ? username : null,
  )

  if (!isAuthenticated || !username || !role) {
    return <Navigate to="/auth/login" replace />
  }

  if (role !== 'TRAINER') {
    return <Navigate to="/profil" replace />
  }

  if (query.isLoading) {
    return <p className="text-sm text-slate-400">Yükleniyor…</p>
  }

  if (query.isError || !query.data) {
    const msg = resolveUserFacingApiErrorMessage(
      query.error,
      'Rapor alınamadı.',
    )
    return (
      <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        {msg}
      </p>
    )
  }

  return <TrainerWorkloadPanel data={query.data} />
}
