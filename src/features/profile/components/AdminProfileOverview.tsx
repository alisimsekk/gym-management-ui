import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChangePasswordForm } from '../../auth/components/ChangePasswordForm'
import { useAuth } from '../../auth/hooks/useAuth'
import { useChangePasswordMutation } from '../../auth/hooks/useChangePasswordMutation'
import type { ChangePasswordRequest } from '../../auth/types/auth.types'
import { useAdminProfileQuery } from '../../admin/hooks/useAdminProfileQuery'
import { useUpdateAdminProfileMutation } from '../../admin/hooks/useUpdateAdminProfileMutation'
import type {
  AdminProfileResponse,
  UpdateAdminProfileRequest,
} from '../../admin/types/adminProfile.types'
import { ApiError } from '../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'

interface AdminProfileFormSectionProps {
  profile: AdminProfileResponse
}

function AdminProfileFormSection({ profile }: AdminProfileFormSectionProps) {
  const updateMutation = useUpdateAdminProfileMutation()
  const [form, setForm] = useState<UpdateAdminProfileRequest>(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
  }))
  const [profileError, setProfileError] = useState<string | null>(null)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    updateMutation.mutate(form, {
      onError: (err: unknown) => {
        if (err instanceof ApiError) {
          setProfileError(
            resolveUserFacingApiErrorMessage(
              err,
              'Profil güncellenemedi.',
            ),
          )
          return
        }
        setProfileError('Profil güncellenemedi.')
      },
    })
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Kimlik özeti
      </h2>
      <dl className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Kullanıcı adı</dt>
          <dd className="font-mono text-white">{profile.username}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Kayıt durumu</dt>
          <dd>
            <span
              className={
                profile.isActive ? 'text-emerald-300' : 'text-amber-200'
              }
            >
              {profile.isActive ? 'Etkin' : 'Etkin değil'}
            </span>
          </dd>
        </div>
      </dl>

      <form className="mt-8 grid max-w-xl gap-4" onSubmit={saveProfile}>
        <label className="grid gap-1 text-sm text-slate-200">
          Ad
          <input
            required
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
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
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
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
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
          />
        </label>
        {profileError && (
          <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {profileError}
          </p>
        )}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="justify-self-start rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
        >
          {updateMutation.isPending ? 'Kaydediliyor…' : 'Bilgileri kaydet'}
        </button>
      </form>
    </section>
  )
}

export function AdminProfileOverview() {
  const { username } = useAuth()
  const profileQuery = useAdminProfileQuery()
  const changePasswordMutation = useChangePasswordMutation()

  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const submitPassword = (payload: ChangePasswordRequest) => {
    setPasswordError(null)
    setPasswordSuccess(null)
    changePasswordMutation.mutate(payload, {
      onSuccess: () => {
        setPasswordSuccess('Şifreniz güncellendi.')
      },
      onError: (err: unknown) => {
        if (err instanceof ApiError) {
          setPasswordError(
            resolveUserFacingApiErrorMessage(
              err,
              'Şifre değiştirilemedi.',
            ),
          )
          return
        }
        setPasswordError('Şifre değiştirilemedi.')
      },
    })
  }

  if (profileQuery.isLoading) {
    return <p className="text-slate-400">Profil yükleniyor…</p>
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <p className="text-rose-300">
        Profiliniz yüklenemedi. Oturumu kontrol edin veya daha sonra yeniden
        deneyin.
      </p>
    )
  }

  const p = profileQuery.data

  return (
    <div className="space-y-10">
      <div>
        <Link
          to="/admin"
          className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
        >
          ← Yönetim paneline dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Bilgilerim</h1>
        <p className="mt-2 text-sm text-slate-400">
          İletişim bilgilerinizi güncelleyin ve giriş şifrenizi buradan
          yenileyin.
        </p>
      </div>

      <AdminProfileFormSection key={p.id} profile={p} />

      <section className="max-w-xl rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Şifre
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Kurumsal güvenlik için güçlü ve benzersiz bir şifre kullanın.
        </p>
        {passwordSuccess && (
          <p className="mt-4 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            {passwordSuccess}
          </p>
        )}
        <div className="mt-6">
          <ChangePasswordForm
            lockedUsername={username ?? p.username}
            loading={changePasswordMutation.isPending}
            error={passwordError}
            onSubmit={submitPassword}
          />
        </div>
      </section>
    </div>
  )
}
