import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TrainerWorkloadEmptyState } from '../../../profile/components/TrainerWorkloadEmptyState'
import { TrainerWorkloadErrorState } from '../../../profile/components/TrainerWorkloadErrorState'
import { TrainerWorkloadPanel } from '../../../profile/components/TrainerWorkloadPanel'
import { getTrainerWorkloadSummary } from '../../../profile/services/workloadService'
import { resolveTrainerWorkloadViewState } from '../../../profile/utils/resolveTrainerWorkloadViewState'
import { trainerWorkloadQueryRetry } from '../../../../shared/utils/trainerWorkloadErrors'

export function AdminTrainerWorkloadPage() {
    const { username } = useParams<{ username: string }>()
    const decoded = username ? decodeURIComponent(username) : ''

    const workloadQuery = useQuery({
        queryKey: ['report', 'workload', decoded] as const,
        queryFn: () => getTrainerWorkloadSummary(decoded),
        enabled: Boolean(decoded),
        retry: trainerWorkloadQueryRetry,
    })

    const viewState = resolveTrainerWorkloadViewState(workloadQuery)

    return (
        <div className="space-y-6">
            <Link
                to="/admin/antrenorler"
                className="text-xs font-medium text-cyan-300 hover:text-cyan-100"
            >
                ← Antrenör listesi
            </Link>

            <header>
                <h1 className="text-2xl font-bold text-white">Antrenör iş yükü</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-400">
                    @{decoded || '…'} kullanıcısının aylık antrenman süre özetini burada
                    görebilirsiniz.
                </p>
            </header>

            {viewState.kind === 'loading' && (
                <p className="text-slate-400">Rapor yükleniyor…</p>
            )}
            {viewState.kind === 'empty' && (
                <TrainerWorkloadEmptyState variant="admin" trainerUsername={decoded} />
            )}
            {viewState.kind === 'error' && (
                <TrainerWorkloadErrorState error={viewState.error} />
            )}
            {viewState.kind === 'ready' && (
                <TrainerWorkloadPanel data={viewState.data} />
            )}
        </div>
    )
}
