import type { FormEvent } from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CredentialRevealCard } from '../../components/CredentialRevealCard'
import {
  createAdminByAdmin,
  type AdminCreateAccountRequest,
} from '../../services/adminUserService'
import type { RegisterResponse } from '../../../auth/types/auth.types'
import { ApiError } from '../../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../../shared/utils/resolveUserFacingApiError'

export function AdminCreateAdminPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<RegisterResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createAdminByAdmin,
    onSuccess: (data) => {
      setResult(data)
      setFirstName('')
      setLastName('')
      setEmail('')
      setError(null)
    },
    onError: (err: unknown) => {
      setResult(null)
      if (err instanceof ApiError) {
        setError(
          resolveUserFacingApiErrorMessage(
            err,
            'Yönetici oluşturulamadı.',
          ),
        )
        return
      }
      setError('Yönetici oluşturulamadı.')
    },
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const payload: AdminCreateAccountRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    }
    mutation.mutate(payload)
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin"
          className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
        >
          ← Panele dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Yeni yönetici hesabı
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Yeni yönetici hesabı için ad, soyad ve e-posta yeterlidir; kullanıcı adı ve
          geçici şifre sistem tarafından oluşturulur.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,minmax(0,320px)]">
        <form
          className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          onSubmit={submit}
        >
          <label className="grid gap-1 text-sm text-slate-200">
            Ad
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            Soyad
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            E-posta
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          {error && (
            <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {mutation.isPending ? 'Gönderiliyor…' : 'Yönetici oluştur'}
          </button>
        </form>
        {result ? <CredentialRevealCard credentials={result} /> : null}
      </div>
    </div>
  )
}
