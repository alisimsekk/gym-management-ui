import { Link } from 'react-router-dom'
import { clearSession, getSession } from '../../auth/utils/authStorage'
import { APP_BRAND_NAME } from '../../../shared/constants/brand'

export function HomePage() {
  const session = getSession()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-6 px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <p className="text-xs uppercase tracking-widest text-cyan-300">
          {APP_BRAND_NAME}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Ana Sayfa</h1>
        <p className="mt-3 text-sm text-slate-300">
          Auth akışı başarıyla kuruldu. Rol bazlı giriş yönlendirmesi aktif.
        </p>

        {session && (
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
            <p>Kullanıcı: {session.username || '-'}</p>
            <p>Rol: {session.role}</p>
            <p>Token bitis: {session.expirationDate}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950"
            to="/auth/change-password"
          >
            Şifre Değiştir
          </Link>
          <Link
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white"
            to="/auth/login"
          >
            Giriş Sayfası
          </Link>
          <button
            type="button"
            className="rounded-full border border-rose-300/30 px-5 py-2 text-sm font-semibold text-rose-200"
            onClick={() => {
              clearSession()
              window.location.href = '/auth/login'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </main>
  )
}
