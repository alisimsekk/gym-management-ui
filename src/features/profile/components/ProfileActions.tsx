import { Link } from 'react-router-dom'

export function ProfileActions() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-300">
        Hesap güvenliğin için şifreni düzenli olarak yenilemeni öneririz.
      </p>
      <Link
        to="/auth/change-password"
        className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Şifre Değiştir
      </Link>
    </div>
  )
}
