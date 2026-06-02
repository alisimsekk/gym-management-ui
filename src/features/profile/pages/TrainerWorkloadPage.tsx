import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { TrainerWorkloadEmptyState } from '../components/TrainerWorkloadEmptyState'
import { TrainerWorkloadErrorState } from '../components/TrainerWorkloadErrorState'
import { TrainerWorkloadPanel } from '../components/TrainerWorkloadPanel'
import { useTrainerWorkload } from '../hooks/useTrainerWorkload'
import { resolveTrainerWorkloadViewState } from '../utils/resolveTrainerWorkloadViewState'

export function TrainerWorkloadPage() {
    const { role, username, isAuthenticated } = useAuth()
    const query = useTrainerWorkload(role === 'TRAINER' ? username : null)
    const viewState = resolveTrainerWorkloadViewState(query)

    if (!isAuthenticated || !username || !role) {
        return <Navigate to="/auth/login" replace />
    }

    if (role !== 'TRAINER') {
        return <Navigate to="/profil" replace />
    }

    if (viewState.kind === 'loading') {
        return <p className="text-sm text-slate-400">Yükleniyor…</p>
    }

    if (viewState.kind === 'empty') {
        return <TrainerWorkloadEmptyState variant="trainer" />
    }

    if (viewState.kind === 'error') {
        return <TrainerWorkloadErrorState error={viewState.error} />
    }

    return <TrainerWorkloadPanel data={viewState.data} />
}
