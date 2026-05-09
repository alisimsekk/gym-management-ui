import { useState } from 'react'
import type { FormEvent } from 'react'
import type { RegisterRequest } from '../types/auth.types'

interface RegisterFormProps {
  loading: boolean
  error: string | null
  onSubmit: (payload: RegisterRequest) => void
}

export function RegisterForm({ loading, error, onSubmit }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    address: '',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      dateOfBirth: form.dateOfBirth || undefined,
      address: form.address || undefined,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
      <label className="grid gap-1 text-sm text-slate-200">
        Doğum Tarihi (opsiyonel)
        <input
          type="date"
          value={form.dateOfBirth ?? ''}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        Adres (opsiyonel)
        <input
          value={form.address ?? ''}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, address: event.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      {error && (
        <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Kayıt oluşturuluyor…' : 'Kayıt Ol'}
      </button>
    </form>
  )
}
