import { useState } from 'react'
import type { RegisterResponse } from '../../auth/types/auth.types'

interface CredentialRevealCardProps {
  credentials: RegisterResponse
  title?: string
}

export function CredentialRevealCard({
  credentials,
  title = 'Kayıt tamam — geçici erişim bilgisi',
}: CredentialRevealCardProps) {
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(
    null,
  )

  const handleCopy = async (field: 'username' | 'password', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      window.setTimeout(() => setCopiedField(null), 2000)
    } catch {
      setCopiedField(null)
    }
  }

  return (
    <aside className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-6">
      <h2 className="text-sm font-semibold text-emerald-200">{title}</h2>
      <p className="mt-2 text-xs leading-relaxed text-emerald-100/90">
        Kullanıcıya şifreyi güvenli bir kanalla iletin; bu bilgiler yeniden
        görüntülenemez.
      </p>
      <dl className="mt-4 grid gap-3 text-sm text-white">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Kullanıcı adı
            </dt>
            <dd className="mt-1 font-mono">{credentials.username}</dd>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('username', credentials.username)}
            className="rounded-full border border-white/25 px-3 py-1 text-xs text-cyan-200 hover:border-cyan-400"
          >
            {copiedField === 'username' ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Geçici şifre
            </dt>
            <dd className="mt-1 font-mono break-all">{credentials.password}</dd>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('password', credentials.password)}
            className="rounded-full border border-white/25 px-3 py-1 text-xs text-cyan-200 hover:border-cyan-400"
          >
            {copiedField === 'password' ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
      </dl>
    </aside>
  )
}
