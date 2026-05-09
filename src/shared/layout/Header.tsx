import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { APP_BRAND_NAME } from '../constants/brand'

const sectionLinks: ReadonlyArray<{ href: string; label: string }> = [
  { href: '#anasayfa', label: 'Ana Sayfa' },
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#grup-dersleri', label: 'Grup Dersleri' },
  { href: '#kisisel-antrenman', label: 'Kişisel Antrenman' },
  { href: '#iletisim', label: 'İletişim' },
]

export function Header() {
  const { isAuthenticated, logout, role } = useAuth()
  const canCreateTraining =
    role === 'TRAINEE' || role === 'TRAINER'
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-lg font-semibold text-white">
          {APP_BRAND_NAME}
        </Link>

        {isLanding && (
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {isAuthenticated ? (
            <>
              {canCreateTraining && (
                <Link
                  to="/antrenman/yeni"
                  className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Antrenman oluştur
                </Link>
              )}
              <Link
                to="/profil"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100"
              >
                Profil
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-full bg-rose-500/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100"
              >
                Giriş Yap
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
