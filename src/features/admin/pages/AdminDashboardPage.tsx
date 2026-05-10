import { Link } from 'react-router-dom'
import {
  adminPrimaryNav,
  adminUserCreateNav,
} from '../layout/adminNav.config'

export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Yönetim özeti
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Sık kullanılan yönetim ekranlarına buradan geçebilir veya sol menüden
          modülleri açabilirsiniz.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminPrimaryNav
          .filter((i) => i.to !== '/admin')
          .map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/40 hover:bg-slate-900"
            >
              <h2 className="text-base font-semibold text-white">
                {item.label}
              </h2>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Aç →
              </span>
            </Link>
          ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Hızlı kullanıcı oluşturma
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {adminUserCreateNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-white/15 bg-slate-900 px-5 py-2 text-sm font-medium text-cyan-100 hover:border-cyan-400"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
