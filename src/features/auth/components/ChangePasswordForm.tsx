import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChangePasswordRequest } from '../types/auth.types'

interface ChangePasswordFormProps {
  lockedUsername: string
  loading: boolean
  error: string | null
  onSubmit: (payload: ChangePasswordRequest) => void
}

export function ChangePasswordForm({
  lockedUsername,
  loading,
  error,
  onSubmit,
}: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!lockedUsername.trim()) {
      setValidationError('Oturum bulunamadi.')
      return
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Yeni şifre ve şifre tekrar alanı aynı olmalıdır.')
      return
    }
    setValidationError(null)
    onSubmit({
      username: lockedUsername.trim(),
      oldPassword,
      newPassword,
    })
  }

  const currentError = validationError ?? error

  return (
    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
      <div className="grid gap-1 text-sm text-slate-200">
        Kullanıcı adı (değiştirilemez)
        <input
          readOnly
          tabIndex={-1}
          name="username"
          value={lockedUsername}
          aria-readonly="true"
          className="cursor-default rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none"
        />
      </div>
      <div className="grid gap-1 text-sm text-slate-200">
        <span>Eski şifre</span>
        <div className="flex gap-2">
          <input
            type={showOld ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
          />
          <button
            type="button"
            onClick={() => setShowOld((v) => !v)}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:border-cyan-300/50"
          >
            {showOld ? 'Gizle' : 'Göster'}
          </button>
        </div>
      </div>
      <div className="grid gap-1 text-sm text-slate-200">
        <span>Yeni şifre</span>
        <div className="flex gap-2">
          <input
            type={showNew ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:border-cyan-300/50"
          >
            {showNew ? 'Gizle' : 'Göster'}
          </button>
        </div>
      </div>
      <div className="grid gap-1 text-sm text-slate-200">
        <span>Yeni şifre (tekrar)</span>
        <div className="flex gap-2">
          <input
            type={showConfirm ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:border-cyan-300/50"
          >
            {showConfirm ? 'Gizle' : 'Göster'}
          </button>
        </div>
      </div>
      {currentError && (
        <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {currentError}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !lockedUsername}
        className="w-full rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Şifre değiştiriliyor…' : 'Şifreyi Değiştir'}
      </button>
    </form>
  )
}
