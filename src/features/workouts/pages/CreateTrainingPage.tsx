import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useTraineesDirectoryQuery } from '../../profile/hooks/useTraineesDirectoryQuery'
import { useTrainersDirectoryQuery } from '../../profile/hooks/useTrainersDirectoryQuery'
import { useTrainingTypesQuery } from '../hooks/useTrainingTypesQuery'
import { useCreateTrainingMutation } from '../hooks/useCreateTrainingMutation'
import { ApiError } from '../../../shared/api/apiError'
import { APP_BRAND_NAME } from '../../../shared/constants/brand'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'

export function CreateTrainingPage() {
  const navigate = useNavigate()
  const { role, username, isAuthenticated } = useAuth()
  const typesQuery = useTrainingTypesQuery()
  const createMutation = useCreateTrainingMutation()

  const traineesCanLoad = Boolean(isAuthenticated && role === 'TRAINER')
  const trainersCanLoad = Boolean(isAuthenticated && role === 'TRAINEE')

  const traineesDirectory = useTraineesDirectoryQuery(
    {},
    { enabled: traineesCanLoad },
  )
  const trainersDirectory = useTrainersDirectoryQuery(
    {},
    { enabled: trainersCanLoad },
  )

  const [trainingName, setTrainingName] = useState('')
  const [trainingDate, setTrainingDate] = useState('')
  const [trainingDuration, setTrainingDuration] = useState(60)
  const [trainingTypeId, setTrainingTypeId] = useState<number>(0)
  const [selectedPeerUsername, setSelectedPeerUsername] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated || !username || !role) {
    return <Navigate to="/auth/login" replace />
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  const isTrainee = role === 'TRAINEE'
  const isTrainer = role === 'TRAINER'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!trainingTypeId) {
      setError('Antrenman türü seçin.')
      return
    }

    const peer = selectedPeerUsername.trim()
    if (!peer) {
      setError(
        isTrainee
          ? 'Listeden bir antrenör seçin.'
          : 'Listeden bir trainee seçin.',
      )
      return
    }

    const traineeUsername = isTrainee ? username : peer
    const trainerUsername = isTrainer ? username : peer

    createMutation.mutate(
      {
        traineeUsername,
        trainerUsername,
        trainingName: trainingName.trim(),
        trainingDate,
        trainingDuration,
        trainingTypeId,
      },
      {
        onSuccess: () => navigate('/profil/antrenmanlar'),
        onError: (err) => {
          if (err instanceof ApiError) {
            setError(
              resolveUserFacingApiErrorMessage(
                err,
                'Antrenman oluşturulamadı.',
              ),
            )
            return
          }
          setError('Antrenman oluşturulamadı.')
        },
      },
    )
  }

  const trainersLoading =
    isTrainee && (trainersDirectory.isLoading || !trainersDirectory.data)
  const traineesLoading =
    isTrainer && (traineesDirectory.isLoading || !traineesDirectory.data)

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-cyan-300">
        {APP_BRAND_NAME}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-white">Antrenman oluştur</h1>
      <p className="mt-2 text-sm text-slate-400">
        {isTrainee &&
          'Trainee olarak sen otomatik seçilirsin; antrenörü listeden seçmen yeterli.'}
        {isTrainer &&
          'Trainer olarak sen antrenör olarak otomatik seçilirsin; trainee listesinden karşı tarafı seçmen yeterli.'}
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-sm text-slate-200">
          Antrenman adı
          <input
            required
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-200">
          Tarih
          <input
            type="date"
            required
            value={trainingDate}
            onChange={(e) => setTrainingDate(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-200">
          Süre (dakika)
          <input
            type="number"
            required
            min={1}
            value={trainingDuration}
            onChange={(e) => setTrainingDuration(Number(e.target.value))}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-200">
          Antrenman türü
          <select
            required
            disabled={typesQuery.isLoading || !typesQuery.data?.length}
            value={trainingTypeId || ''}
            onChange={(e) => setTrainingTypeId(Number(e.target.value))}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          >
            <option value="">Seçin</option>
            {(typesQuery.data ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.trainingTypeName}
              </option>
            ))}
          </select>
        </label>

        {isTrainee && (
          <label className="grid gap-1 text-sm text-slate-200">
            Antrenör seçimi
            <select
              required
              disabled={trainersLoading}
              value={selectedPeerUsername}
              onChange={(e) => setSelectedPeerUsername(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
            >
              <option value="">
                {trainersDirectory.isLoading
                  ? 'Antrenörler yükleniyor…'
                  : 'Antrenör seç'}
              </option>
              {(trainersDirectory.data ?? []).map((t) => (
                <option key={t.username} value={t.username}>
                  {t.firstName} {t.lastName} — {t.specialization}
                </option>
              ))}
            </select>
          </label>
        )}

        {isTrainer && (
          <label className="grid gap-1 text-sm text-slate-200">
            Trainee seçimi
            <select
              required
              disabled={traineesLoading}
              value={selectedPeerUsername}
              onChange={(e) => setSelectedPeerUsername(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
            >
              <option value="">
                {traineesDirectory.isLoading
                  ? 'Trainee listesi yükleniyor…'
                  : 'Trainee seç'}
              </option>
              {(traineesDirectory.data ?? []).map((t) => (
                <option key={t.username} value={t.username}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && (
          <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              (isTrainee && trainersDirectory.isError) ||
              (isTrainer && traineesDirectory.isError)
            }
            className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {createMutation.isPending ? 'Oluşturuluyor…' : 'Oluştur'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-slate-200 hover:border-cyan-300"
          >
            Vazgeç
          </button>
        </div>
      </form>
    </main>
  )
}
