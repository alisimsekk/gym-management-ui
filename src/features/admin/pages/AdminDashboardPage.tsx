import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-4 px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <p className="text-xs uppercase tracking-widest text-cyan-300">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Yönetim Paneli</h1>
        <p className="mt-3 text-sm text-slate-300">
          Admin rolü ile giriş yapıldığında bu ekrana yönlendirilir.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white"
          to="/"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  )
}
