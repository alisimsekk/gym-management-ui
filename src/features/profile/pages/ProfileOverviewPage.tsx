import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { AdminProfileOverview } from '../components/AdminProfileOverview'
import { ProfileActions } from '../components/ProfileActions'
import { AssignedTrainersSummary } from '../components/AssignedTrainersSummary'
import { TraineeProfileForm } from '../components/TraineeProfileForm'
import { TrainerProfileForm } from '../components/TrainerProfileForm'
import { AssignedTraineesSummary } from '../components/AssignedTraineesSummary'
import { useTraineeProfile } from '../hooks/useTraineeProfile'
import { useTrainerProfile } from '../hooks/useTrainerProfile'
import { useUpdateTrainee } from '../hooks/useUpdateTrainee'
import { useUpdateTrainer } from '../hooks/useUpdateTrainer'
import type {
  UpdateTraineeRequest,
  UpdateTrainerRequest,
} from '../types/profile.types'

const TraineeOverview = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error: queryError } =
    useTraineeProfile(username)
  const updateTrainee = useUpdateTrainee()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (isLoading) {
    return <p className="text-sm text-slate-400">Profil yükleniyor…</p>
  }

  if (isError || !data) {
    const message = resolveUserFacingApiErrorMessage(
      queryError,
      'Profil bilgileri alınamadı.',
    )
    return (
      <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        {message}
      </p>
    )
  }

  const handleSubmit = (payload: UpdateTraineeRequest) => {
    setError(null)
    setSuccessMessage(null)
    updateTrainee.mutate(
      { id: data.id, username: data.username, payload },
      {
        onSuccess: () => {
          setSuccessMessage('Profil bilgileri güncellendi.')
        },
        onError: (err) => {
          setError(
            resolveUserFacingApiErrorMessage(
              err,
              'Profil güncellemesi başarısız oldu.',
            ),
          )
        },
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-6">
        <TraineeProfileForm
          profile={data}
          loading={updateTrainee.isPending}
          error={error}
          successMessage={successMessage}
          onSubmit={handleSubmit}
        />
        <ProfileActions />
      </div>
      <AssignedTrainersSummary trainers={data.trainers ?? []} />
    </div>
  )
}

const TrainerOverview = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error: queryError } =
    useTrainerProfile(username)
  const updateTrainer = useUpdateTrainer()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (isLoading) {
    return <p className="text-sm text-slate-400">Profil yükleniyor…</p>
  }

  if (isError || !data) {
    const message = resolveUserFacingApiErrorMessage(
      queryError,
      'Profil bilgileri alınamadı.',
    )
    return (
      <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        {message}
      </p>
    )
  }

  const handleSubmit = (payload: UpdateTrainerRequest) => {
    setError(null)
    setSuccessMessage(null)
    updateTrainer.mutate(
      { id: data.id, username: data.username, payload },
      {
        onSuccess: () => {
          setSuccessMessage('Profil bilgileri güncellendi.')
        },
        onError: (err) => {
          setError(
            resolveUserFacingApiErrorMessage(
              err,
              'Profil güncellemesi başarısız oldu.',
            ),
          )
        },
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-6">
        <TrainerProfileForm
          profile={data}
          loading={updateTrainer.isPending}
          error={error}
          successMessage={successMessage}
          onSubmit={handleSubmit}
        />
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm font-medium text-white">Antrenman iş yükü özeti</p>
          <p className="mt-1 text-xs text-slate-500">
            Yıllık ve aylık toplam süreleri rapor görünümünde izle.
          </p>
          <Link
            to="/profil/is-yuku"
            className="mt-4 inline-flex rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Raporu aç
          </Link>
        </div>
        <ProfileActions />
      </div>
      <AssignedTraineesSummary count={data.trainees?.length ?? 0} />
    </div>
  )
}

export function ProfileOverviewPage() {
  const { role, username, isAuthenticated } = useAuth()

  if (!isAuthenticated || !username || !role) {
    return <Navigate to="/auth/login" replace />
  }

  if (role === 'ADMIN') {
    return <AdminProfileOverview />
  }

  return role === 'TRAINEE' ? (
    <TraineeOverview username={username} />
  ) : (
    <TrainerOverview username={username} />
  )
}
