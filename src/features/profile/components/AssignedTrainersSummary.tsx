import { Link } from 'react-router-dom'
import type { TrainerBasicInfoDto } from '../types/profile.types'

interface AssignedTrainersSummaryProps {
  trainers: TrainerBasicInfoDto[]
}

export function AssignedTrainersSummary({
  trainers,
}: AssignedTrainersSummaryProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Atanmış antrenörler</h2>
        <Link
          to="/profil/antrenorler"
          className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10"
        >
          Antrenörlerimi yönet
        </Link>
      </header>

      <p className="mb-3 text-xs text-slate-500">
        Liste güncelleme ve arama için yönetim sayfasına geç.
      </p>

      {trainers.length === 0 ? (
        <p className="text-sm text-slate-400">
          Henüz atanmış antrenör yok. Antrenör seçimi yapabilirsin.
        </p>
      ) : (
        <ul className="grid gap-2">
          {trainers.map((trainer) => (
            <li
              key={trainer.username}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
            >
              <p className="font-medium text-white">
                {trainer.firstName} {trainer.lastName}
              </p>
              <p className="mt-1 text-xs text-cyan-300">{trainer.specialization}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
