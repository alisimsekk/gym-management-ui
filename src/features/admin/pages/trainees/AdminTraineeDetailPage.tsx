import type { ChangeEvent, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteTraineeByUsername,
  toggleTraineeActiveStatus,
} from '../../../profile/services/profileService'
import { traineeProfileKey, useTraineeProfile } from '../../../profile/hooks/useTraineeProfile'
import { useUpdateTrainee } from '../../../profile/hooks/useUpdateTrainee'
import { useUpdateTraineeTrainers } from '../../../profile/hooks/useUpdateTraineeTrainers'
import { useTrainersDirectoryQuery } from '../../../profile/hooks/useTrainersDirectoryQuery'
import type {
  TrainerProfileResponse,
  TraineeProfileResponse,
  TrainerBasicInfoDto,
  UpdateTraineeRequest,
} from '../../../profile/types/profile.types'
import { AccountActiveToggle } from '../../components/AccountActiveToggle'
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog'
import { ApiError } from '../../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../../shared/utils/resolveUserFacingApiError'

function buildAssignedMap(
  profile: TraineeProfileResponse,
  directory: TrainerProfileResponse[],
): Record<string, boolean> {
  const init: Record<string, boolean> = {}
  directory.forEach((t) => {
    init[t.username] =
      profile.trainers?.some((x) => x.username === t.username) ?? false
  })
  profile.trainers?.forEach((t: TrainerBasicInfoDto) => {
    init[t.username] = true
  })
  return init
}

interface TraineeProfileFormPanelProps {
  profile: TraineeProfileResponse
  decodedUsername: string
}

function TraineeProfileFormPanel({
  profile,
  decodedUsername,
}: TraineeProfileFormPanelProps) {
  const updateMutation = useUpdateTrainee()
  const [form, setForm] = useState(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    dateOfBirth: profile.dateOfBirth,
    address: profile.address ?? '',
  }))
  const [error, setError] = useState<string | null>(null)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const payload: UpdateTraineeRequest = {
      ...form,
      isActive: profile.isActive,
    }
    updateMutation.mutate(
      { id: profile.id, username: decodedUsername, payload },
      {
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
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Profil
      </h2>
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
        Doğum tarihi
        <input
          type="date"
          value={form.dateOfBirth ?? ''}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              dateOfBirth: e.target.value || undefined,
            }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        Adres
        <textarea
          value={form.address ?? ''}
          onChange={(e) =>
            setForm((f) => ({ ...f, address: e.target.value }))
          }
          rows={3}
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
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
        {updateMutation.isPending ? 'Kaydediliyor…' : 'Profili kaydet'}
      </button>
    </form>
  )
}

interface TraineeAssignmentsPanelProps {
  profile: TraineeProfileResponse
  directory: TrainerProfileResponse[]
  directoryLoading: boolean
  decodedUsername: string
}

function TraineeAssignmentsPanel({
  profile,
  directory,
  directoryLoading,
  decodedUsername,
}: TraineeAssignmentsPanelProps) {
  const trainersMutation = useUpdateTraineeTrainers()
  const [trainerFilter, setTrainerFilter] = useState('')
  const [assigned, setAssigned] = useState<Record<string, boolean>>(() =>
    buildAssignedMap(profile, directory),
  )
  const [trainerError, setTrainerError] = useState<string | null>(null)

  const filteredTrainers = useMemo(() => {
    const term = trainerFilter.trim().toLowerCase()
    if (!term) return directory
    return directory.filter((t) => {
      const blob = `${t.firstName} ${t.lastName} ${t.username} ${t.specialization}`.toLowerCase()
      return blob.includes(term)
    })
  }, [trainerFilter, directory])

  const toggleTrainerAssigned = (
    trainerUsername: string,
    checked: boolean,
  ) => {
    setAssigned((prev) => ({ ...prev, [trainerUsername]: checked }))
  }

  const onCheckboxChange =
    (usernameKey: string) => (event: ChangeEvent<HTMLInputElement>) => {
      toggleTrainerAssigned(usernameKey, event.target.checked)
    }

  const saveTrainers = (e: FormEvent) => {
    e.preventDefault()
    setTrainerError(null)
    const trainerUsernames = Object.entries(assigned)
      .filter(([, ok]) => ok)
      .map(([u]) => u)
    if (trainerUsernames.length === 0) {
      setTrainerError('En az bir antrenör seçilmeli.')
      return
    }
    trainersMutation.mutate(
      { username: decodedUsername, payload: { trainerUsernames } },
      {
        onError: (err: unknown) => {
          if (err instanceof ApiError) {
            setTrainerError(
              resolveUserFacingApiErrorMessage(
                err,
                'Antrenör listesi güncellenemedi.',
              ),
            )
            return
          }
          setTrainerError('Antrenör listesi güncellenemedi.')
        },
      },
    )
  }

  return (
    <form
      onSubmit={saveTrainers}
      className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Antrenör atamaları
        </h2>
        <input
          placeholder="Liste içinde ara…"
          value={trainerFilter}
          onChange={(e) => setTrainerFilter(e.target.value)}
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-1.5 text-sm text-white"
        />
      </div>
      <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/40 p-3">
        {directoryLoading ? (
          <p className="text-sm text-slate-400">Antrenör listesi…</p>
        ) : (
          <ul className="grid gap-2">
            {filteredTrainers.map((t) => (
              <li
                key={t.username}
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/5"
              >
                <input
                  id={`trainer-${t.username}`}
                  type="checkbox"
                  checked={Boolean(assigned[t.username])}
                  onChange={onCheckboxChange(t.username)}
                  className="size-4 rounded border-white/20"
                />
                <label
                  htmlFor={`trainer-${t.username}`}
                  className="cursor-pointer flex-1 text-sm text-slate-200"
                >
                  <span className="font-medium">
                    {t.firstName} {t.lastName}
                  </span>
                  <span className="ml-2 font-mono text-xs text-slate-500">
                    @{t.username}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {t.specialization}
                  </span>
                </label>
                <Link
                  className="text-xs text-cyan-300"
                  to={`/admin/antrenorler/${encodeURIComponent(t.username)}`}
                >
                  detay
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {trainerError && (
        <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {trainerError}
        </p>
      )}
      <button
        type="submit"
        disabled={trainersMutation.isPending}
        className="rounded-full bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
      >
        {trainersMutation.isPending ? 'Kaydediliyor…' : 'Antrenörleri kaydet'}
      </button>
    </form>
  )
}

export function AdminTraineeDetailPage() {
  const { username } = useParams<{ username: string }>()
  const decoded = username ? decodeURIComponent(username) : null
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const profileQuery = useTraineeProfile(decoded)
  const trainersDirectory = useTrainersDirectoryQuery({}, {})

  const [deleteOpen, setDeleteOpen] = useState(false)

  const profile = profileQuery.data
  const directory = trainersDirectory.data ?? []
  const dirKey = directory.map((t) => t.username).sort().join(',')
  const trainerOnProfileKey = (profile?.trainers ?? [])
    .map((t) => t.username)
    .sort()
    .join(',')

  const invalidateLists = (): void => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'trainees'] })
    if (decoded) {
      queryClient.invalidateQueries({
        queryKey: traineeProfileKey(decoded),
      })
    }
  }

  const deleteMutation = useMutation({
    mutationFn: deleteTraineeByUsername,
    onSuccess: () => {
      invalidateLists()
      void navigate('/admin/ogrenciler')
    },
  })

  const statusMutation = useMutation({
    mutationFn: (id: number) => toggleTraineeActiveStatus(id),
    onSuccess: async () => {
      invalidateLists()
      if (decoded) {
        await queryClient.refetchQueries({
          queryKey: traineeProfileKey(decoded),
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
            to="/admin/ogrenciler"
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

      <TraineeProfileFormPanel
        key={`${profile.id}-${profile.isActive}`}
        profile={profile}
        decodedUsername={decoded}
      />

      <AccountActiveToggle
        isActive={profile.isActive}
        pending={statusMutation.isPending}
        onChange={() => statusMutation.mutate(profile.id)}
      />

      <TraineeAssignmentsPanel
        key={`${profile.id}-${dirKey}-${trainerOnProfileKey}`}
        profile={profile}
        directory={directory}
        directoryLoading={trainersDirectory.isLoading}
        decodedUsername={decoded}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Öğrenciyi sil"
        description="Bu kullanıcı kalıcı olarak silinebilir. İşlem geri alınamaz."
        variant="danger"
        confirmLabel="Sil"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(profile.username)}
      />

    </div>
  )
}
