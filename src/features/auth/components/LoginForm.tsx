import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginRequest } from '../types/auth.types'

interface LoginFormProps {
  loading: boolean
  error: string | null
  onSubmit: (payload: LoginRequest) => void
}

export function LoginForm({ loading, error, onSubmit }: LoginFormProps) {
  const [form, setForm] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="grid gap-1 text-sm text-slate-200">
        Kullanıcı adı
        <input
          required
          value={form.username}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, username: event.target.value }))
          }
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="grid gap-1 text-sm text-slate-200">
        Şifre
        <input
          type="password"
          required
          value={form.password}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
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
        {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>
    </form>
  )
}
