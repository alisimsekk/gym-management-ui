import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  TrainerProfileResponse,
  UpdateTrainerRequest,
} from '../types/profile.types'

interface TrainerProfileFormProps {
  profile: TrainerProfileResponse
  loading: boolean
  error: string | null
  successMessage: string | null
  onSubmit: (payload: UpdateTrainerRequest) => void
}

interface FormState {
  firstName: string
  lastName: string
  email: string
}

const buildInitialState = (profile: TrainerProfileResponse): FormState => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email ?? '',
})

export function TrainerProfileForm({
  profile,
  loading,
  error,
  successMessage,
  onSubmit,
}: TrainerProfileFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(profile))

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- profil refetch senkronu */
    setForm(buildInitialState(profile))
  }, [profile])

  const specializationId = profile.specializationId
  const specializationMissing = specializationId === undefined

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (specializationId === undefined) {
      return
    }
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      specializationId,
      isActive: profile.isActive,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5"
    >
      <div className="grid gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          Kullanıcı adı
        </span>
        <p className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white">
          {profile.username}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-slate-200">
          Ad
          <input
            required
            value={form.firstName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, firstName: event.target.value }))
            }
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-200">
          Soyad
          <input
            required
            value={form.lastName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lastName: event.target.value }))
            }
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm text-slate-200">
        E-posta
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, email: event.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
        />
      </label>

      <div className="grid gap-1 text-sm text-slate-200">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          Uzmanlık alanı
        </span>
        <p className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white">
          {profile.specialization}
        </p>
        <p className="text-xs text-slate-500">
          Uzmanlık alanı değişikliği için yönetici ile iletişime geçebilirsin.
        </p>
      </div>

      {specializationMissing && (
        <p className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Uzmanlık kimliği API cevabında yok. Profil güncellemesi için backend
          sürümü specializationId alanını döndürmeli (güncel sürümde
          olmalıdır).
        </p>
      )}

      {error && (
        <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || specializationMissing}
        className="w-fit rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Kaydediliyor…' : 'Bilgileri güncelle'}
      </button>
    </form>
  )
}
