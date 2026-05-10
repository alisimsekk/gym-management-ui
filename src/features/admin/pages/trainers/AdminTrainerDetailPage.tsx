import type { FormEvent } from 'react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteTrainerByUsername,
  toggleTrainerActiveStatus,
} from '../../../profile/services/profileService'
import { trainerProfileKey, useTrainerProfile } from '../../../profile/hooks/useTrainerProfile'
import { useUpdateTrainer } from '../../../profile/hooks/useUpdateTrainer'
import type {
  TrainerProfileResponse,
  UpdateTrainerRequest,
} from '../../../profile/types/profile.types'
import type { TrainingTypeResponse } from '../../../workouts/types/workout.types'
import { getTrainingTypes } from '../../../workouts/services/trainingTypeService'
import { AccountActiveToggle } from '../../components/AccountActiveToggle'
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog'
import { ApiError } from '../../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../../shared/utils/resolveUserFacingApiError'

interface TrainerProfileFormPanelProps {
  profile: TrainerProfileResponse
  trainingTypes: TrainingTypeResponse[]
  typesLoading: boolean
  decodedUsername: string
}

function specializationIdFrom(
  profile: TrainerProfileResponse,
  trainingTypes: TrainingTypeResponse[],
): number {
  return (
    profile.specializationId ??
    trainingTypes.find((x) => x.trainingTypeName === profile.specialization)
      ?.id ??
    trainingTypes[0]?.id ??
    0
  )
}

function TrainerProfileFormPanel({
  profile,
  trainingTypes,
  typesLoading,
  decodedUsername,
}: TrainerProfileFormPanelProps) {
  const updateMutation = useUpdateTrainer()

  const [form, setForm] = useState(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    specializationId: specializationIdFrom(profile, trainingTypes),
  }))

  const [error, setError] = useState<string | null>(null)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload: UpdateTrainerRequest = {
      ...form,
      isActive: profile.isActive,
    }
    updateMutation.mutate(
      { id: profile.id, username: decodedUsername, payload },
      {
        onSuccess: () => setError(null),
        onError: (err: unknown) => {
          if (err instanceof ApiError) {
            setError(
              resolveUserFacingApiErrorMessage(
                err,
                'Güncellenemedi.',
              ),
            )
            return
          }
          setError('Güncellenemedi.')
        },
      },
    )
  }

  return (
    <form
      onSubmit={saveProfile}
      className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
    >
      <label className="grid gap-1 text-sm text-slate-200">
        Ad
        <input
          required
          value={form.firstName}
          onChange={(e) =>
            setForm((f) => ({ ...f, firstName: e.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        Soyad
        <input
          required
          value={form.lastName}
          onChange={(e) =>
            setForm((f) => ({ ...f, lastName: e.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        E-posta
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        Uzmanlık (tür ID)
        <select
          required
          value={form.specializationId || ''}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              specializationId: Number(e.target.value),
            }))
          }
          disabled={typesLoading || trainingTypes.length === 0}
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        >
          {trainingTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.trainingTypeName}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="rounded-full bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
      >
        {updateMutation.isPending ? 'Kaydediliyor…' : 'Kaydı güncelle'}
      </button>
    </form>
  )
}

export function AdminTrainerDetailPage() {
  const { username } = useParams<{ username: string }>()
  const decoded = username ? decodeURIComponent(username) : null
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const profileQuery = useTrainerProfile(decoded)
  const typesQuery = useQuery({
    queryKey: ['training-types', 'all'],
    queryFn: getTrainingTypes,
  })

  const [deleteOpen, setDeleteOpen] = useState(false)

  const profile = profileQuery.data
  const trainingTypes = typesQuery.data ?? []
  const typeKey = trainingTypes.map((t) => t.id).join(',')

  const invalidateLists = (): void => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'trainers'] })
    if (decoded) {
      queryClient.invalidateQueries({
        queryKey: trainerProfileKey(decoded),
      })
    }
  }

  const deleteMutation = useMutation({
    mutationFn: deleteTrainerByUsername,
    onSuccess: () => {
      invalidateLists()
      void navigate('/admin/antrenorler')
    },
  })

  const statusMutation = useMutation({
    mutationFn: (id: number) => toggleTrainerActiveStatus(id),
    onSuccess: async () => {
      invalidateLists()
      if (decoded) {
        await queryClient.refetchQueries({
          queryKey: trainerProfileKey(decoded),
        })
      }
    },
  })

  if (!decoded) {
    return (
      <p className="text-rose-300">Geçersiz adres: kullanıcı adı eksik.</p>
    )
  }

  if (profileQuery.isLoading || !profile) {
    return <p className="text-slate-400">Profil yükleniyor…</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/antrenorler"
            className="text-xs font-medium text-cyan-300 hover:text-cyan-100"
          >
            ← Liste
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="font-mono text-sm text-slate-500">{profile.username}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/raporlar/antrenor/${encodeURIComponent(profile.username)}`}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-cyan-200 hover:border-cyan-400"
          >
            İş yükü raporu
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteMutation.isPending}
            className="rounded-full border border-rose-400/45 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/10 disabled:opacity-50"
          >
            Sil
          </button>
        </div>
      </div>

      <TrainerProfileFormPanel
        key={`${profile.id}-${typeKey}-${profile.isActive}`}
        profile={profile}
        trainingTypes={trainingTypes}
        typesLoading={typesQuery.isLoading}
        decodedUsername={decoded}
      />

      <AccountActiveToggle
        isActive={profile.isActive}
        pending={statusMutation.isPending}
        onChange={() => statusMutation.mutate(profile.id)}
      />

      <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Atanmış öğrenciler
        </h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {(profile.trainees ?? []).length === 0 ? (
            <li className="text-slate-500">Liste boş.</li>
          ) : (
            profile.trainees?.map((s) => (
              <li key={s.username}>
                <Link
                  className="text-cyan-300 hover:text-cyan-100"
                  to={`/admin/ogrenciler/${encodeURIComponent(s.username)}`}
                >
                  {s.firstName} {s.lastName}
                </Link>
                <span className="ml-2 font-mono text-xs text-slate-500">
                  @{s.username}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Antrenörü sil"
        description="Bu kullanıcı kalıcı olarak silinebilir. İşlem geri alınamaz. Devam edilsin mi?"
        variant="danger"
        confirmLabel="Sil"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(profile.username)}
      />

    </div>
  )
}
