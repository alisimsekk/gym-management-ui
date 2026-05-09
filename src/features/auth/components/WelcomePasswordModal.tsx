import { useEffect, useRef } from 'react'

interface WelcomePasswordModalProps {
  username: string
  plainPassword: string
  onDismiss: () => void
}

export function WelcomePasswordModal({
  username,
  plainPassword,
  onDismiss,
}: WelcomePasswordModalProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div
        ref={rootRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900 p-6 shadow-xl outline-none"
      >
        <h2
          id="welcome-title"
          className="text-xl font-semibold text-white"
        >
          Hoş geldin, {username}!
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Hesabın oluşturuldu. Güvenliğin için sana otomatik üretilen şifreyi bir
          şifre yöneticisine veya güvenilir bir ortama kaydet; bu iletiyi
          kapattıktan sonra yeniden görüntüleyemezsin.
        </p>
        <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-500/10 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-200">
            Tek seferlik şifren
          </p>
          <p className="mt-2 select-all break-all font-mono text-sm text-white">
            {plainPassword}
          </p>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Şifreyi daha sonra{' '}
          <span className="text-slate-400">Profil — Şifre değiştir</span>{' '}
          bölümünden güncelleyebilirsin.
        </p>
        <button
          type="button"
          onClick={() => onDismiss()}
          className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Anladım
        </button>
      </div>
    </div>
  )
}
