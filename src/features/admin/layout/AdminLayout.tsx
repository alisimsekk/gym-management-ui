import { NavLink, Outlet } from 'react-router-dom'
import { adminPrimaryNav, adminUserCreateNav } from './adminNav.config'

const linkClass =
  'block rounded-xl border px-3 py-2 text-sm transition border-transparent text-slate-300 hover:border-white/15 hover:bg-white/5'

const activeClass =
  'border-cyan-400/45 bg-cyan-500/10 text-cyan-100 font-medium'

export function AdminLayout() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
      <aside className="w-full shrink-0 sm:max-w-xs">
        <div className="sticky top-24 rounded-3xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Yönetim paneli
          </p>
          <nav className="mt-4 grid gap-1" aria-label="Ana yönetim">
            {adminPrimaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ''}`
                }
              >
                <span>{item.label}</span>
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  {item.description}
                </span>
              </NavLink>
            ))}
          </nav>
          <hr className="my-6 border-white/10" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kullanıcı oluşturma
          </p>
          <nav className="mt-3 grid gap-1" aria-label="Kullanıcı oluşturma">
            {adminUserCreateNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
