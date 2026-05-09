import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { AssignedTraineesList } from '../components/AssignedTraineesList'
import { useTrainerProfile } from '../hooks/useTrainerProfile'

export function TrainerAssignedTraineesPage() {
  const { role, username, isAuthenticated } = useAuth()
  const query = useTrainerProfile(
    role === 'TRAINER' && username ? username : null,
  )

  if (!isAuthenticated || !username) {
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
      'Öğrenci listesi alınamadı.',
    )
    return (
      <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        {msg}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Sana atanmış öğrenciler salt okunur listelenir. Düzenlemeler yönetici
        veya trainee profili üzerinden yapılır.
      </p>
      <AssignedTraineesList trainees={query.data.trainees ?? []} />
    </div>
  )
}
