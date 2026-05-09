import type { TraineeBasicInfoDto } from '../types/profile.types'

interface AssignedTraineesListProps {
  trainees: TraineeBasicInfoDto[]
}

export function AssignedTraineesList({ trainees }: AssignedTraineesListProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Atanmış öğrenciler</h2>
        <span className="text-xs text-slate-400">{trainees.length} öğrenci</span>
      </header>

      {trainees.length === 0 ? (
        <p className="text-sm text-slate-400">
          Henüz size atanmış bir öğrenci bulunmuyor.
        </p>
      ) : (
        <ul className="grid gap-2">
          {trainees.map((trainee) => (
            <li
              key={trainee.username}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
            >
              <p className="font-medium text-white">
                {trainee.firstName} {trainee.lastName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
