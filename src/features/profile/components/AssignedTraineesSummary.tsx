import { Link } from 'react-router-dom'

interface AssignedTraineesSummaryProps {
  count: number
}

export function AssignedTraineesSummary({ count }: AssignedTraineesSummaryProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Atanmış öğrenciler</h2>
        <Link
          to="/profil/ogrencilerim"
          className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10"
        >
          Öğrencilerimi görüntüle
        </Link>
      </header>
      <p className="text-sm text-slate-400">{count} öğrenci listelenmiş.</p>
    </section>
  )
}
