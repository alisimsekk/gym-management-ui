import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTrainerWorkloadSummary } from '../../../profile/services/workloadService'
import { TrainerWorkloadPanel } from '../../../profile/components/TrainerWorkloadPanel'

export function AdminTrainerWorkloadPage() {
  const { username } = useParams<{ username: string }>()
  const decoded = username ? decodeURIComponent(username) : ''

  const workloadQuery = useQuery({
    queryKey: ['report', 'workload', decoded] as const,
    queryFn: () => getTrainerWorkloadSummary(decoded),
    enabled: Boolean(decoded),
  })

  return (
    <div className="space-y-6">
      <Link
        to="/admin/antrenorler"
        className="text-xs font-medium text-cyan-300 hover:text-cyan-100"
      >
        ← Antrenör listesi
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-white">
          Antrenör iş yükü
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          @{decoded || '…'} kullanıcısının aylık antrenman süre özetini burada görebilirsiniz.
        </p>
      </header>

      {workloadQuery.isLoading && (
        <p className="text-slate-400">Rapor yükleniyor…</p>
      )}
      {workloadQuery.isError && (
        <p className="text-rose-300">Rapor alınamadı.</p>
      )}
      {workloadQuery.data ? (
        <TrainerWorkloadPanel data={workloadQuery.data} />
      ) : null}
    </div>
  )
}
