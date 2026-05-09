import type { TrainerWorkloadSummary } from '../types/workload.types'

const monthLabelsTr = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

function formatMonthLabel(raw: string | number): string {
  if (typeof raw === 'number' && raw >= 1 && raw <= 12) {
    return monthLabelsTr[raw - 1] ?? String(raw)
  }
  const s = String(raw)
  const upper = s.toUpperCase()
  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ]
  const idx = monthNames.indexOf(upper)
  if (idx >= 0) return monthLabelsTr[idx]
  return s
}

interface TrainerWorkloadPanelProps {
  data: TrainerWorkloadSummary
}

export function TrainerWorkloadPanel({ data }: TrainerWorkloadPanelProps) {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Antrenör</p>
        <p className="text-lg font-semibold text-white">
          {data.trainerFirstName} {data.trainerLastName}
        </p>
        <p className="text-xs text-slate-500">@{data.trainerUsername}</p>
        <p className="mt-2 text-xs text-slate-400">
          Durum:{' '}
          <span className={data.active ? 'text-emerald-300' : 'text-rose-300'}>
            {data.active ? 'Aktif' : 'Pasif'}
          </span>
        </p>
      </div>

      {data.yearlyWorkloads.length === 0 ? (
        <p className="text-sm text-slate-400">Henüz iş yükü verisi yok.</p>
      ) : (
        data.yearlyWorkloads.map((yw) => (
          <section
            key={yw.year}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">{yw.year}</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {yw.monthlyWorkloads.map((mw, idx) => (
                <div
                  key={`${yw.year}-${String(mw.month)}-${idx}`}
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <p className="text-xs font-medium text-cyan-300">
                    {formatMonthLabel(mw.month)}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {mw.totalTrainingDuration}
                  </p>
                  <p className="text-xs text-slate-500">dakika</p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
