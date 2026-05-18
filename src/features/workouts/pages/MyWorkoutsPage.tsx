import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { ApiError } from '../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog'
import { useDeleteTrainingMutation } from '../hooks/useDeleteTrainingMutation'
import { useMyTrainingsQuery } from '../hooks/useMyTrainingsQuery'
import { useTrainingTypesQuery } from '../hooks/useTrainingTypesQuery'
import { TrainingEditModal } from '../components/TrainingEditModal'
import type { TrainingResponse } from '../types/workout.types'
import { formatTrainingDateTimeForDisplay } from '../utils/trainingSchedule.utils'

export function MyWorkoutsPage() {
    const { role, username, isAuthenticated } = useAuth()
    const { data, isLoading, isError, error } = useMyTrainingsQuery()
    const typesQuery = useTrainingTypesQuery()
    const deleteMutation = useDeleteTrainingMutation()
    const [editing, setEditing] = useState<TrainingResponse | null>(null)
    const [pendingDelete, setPendingDelete] = useState<TrainingResponse | null>(
        null,
    )
    const [deleteError, setDeleteError] = useState<string | null>(null)

    if (!isAuthenticated || !username || !role) {
        return <Navigate to="/auth/login" replace />
    }

    if (role === 'ADMIN') {
        return <Navigate to="/admin" replace />
    }

    const errMsg =
        error instanceof ApiError
            ? resolveUserFacingApiErrorMessage(error, 'Liste yüklenemedi.')
            : 'Liste yüklenemedi.'

    const executeDelete = (row: TrainingResponse) => {
        setDeleteError(null)
        deleteMutation.mutate(row.id, {
            onSuccess: () => {
                setPendingDelete(null)
            },
            onError: (err) => {
                setDeleteError(
                    resolveUserFacingApiErrorMessage(err, 'Silme işlemi başarısız.'),
                )
            },
        })
    }

    const deleteTargetMatchesPending =
        pendingDelete !== null &&
        deleteMutation.variables === pendingDelete.id &&
        deleteMutation.isPending

    return (
        <div>
            <p className="mb-4 text-sm text-slate-400">
                Sistemdeki antrenman listen görüntülenir. Düzenlemede kendi
                kullanıcı adın değiştirilemez.
            </p>

            {isLoading && (
                <p className="text-sm text-slate-400">Antrenmanlar yükleniyor…</p>
            )}
            {isError && (
                <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    {errMsg}
                </p>
            )}
            {deleteError && (
                <p className="mb-3 whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    {deleteError}
                </p>
            )}

            {!isLoading && data && data.length === 0 && (
                <p className="text-sm text-slate-400">Kayıt bulunamadı.</p>
            )}

            {data && data.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                        <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                            <th className="p-3">Ad</th>
                            <th className="p-3">Tarih / Saat</th>
                            <th className="p-3">Tür</th>
                            <th className="p-3">Süre</th>
                            <th className="p-3">Trainee</th>
                            <th className="p-3">Antrenör</th>
                            <th className="p-3">İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-white/5 text-slate-200 last:border-0"
                            >
                                <td className="p-3 font-medium text-white">
                                    {row.trainingName}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {formatTrainingDateTimeForDisplay(row.trainingDateTime)}
                                </td>
                                <td className="p-3">{row.trainingType}</td>
                                <td className="p-3">{row.duration} dk</td>
                                <td className="p-3 text-sm text-white">{row.traineeName}</td>
                                <td className="p-3 text-sm text-white">{row.trainerName}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(row)}
                                            className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            type="button"
                                            disabled={deleteMutation.isPending}
                                            onClick={() => {
                                                setDeleteError(null)
                                                setPendingDelete(row)
                                            }}
                                            className="rounded-full border border-rose-400/35 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/15 disabled:opacity-50"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pendingDelete && (
                <ConfirmDialog
                    open
                    variant="danger"
                    title="Antrenmanı sil"
                    description={`"${pendingDelete.trainingName}" antrenmanını silmek istediğine emin misin? Bu işlem geri alınamaz.`}
                    cancelLabel="Vazgeç"
                    confirmLabel="Sil"
                    isConfirming={deleteTargetMatchesPending}
                    onCancel={() => setPendingDelete(null)}
                    onConfirm={() => executeDelete(pendingDelete)}
                />
            )}

            {editing && (
                <TrainingEditModal
                    training={editing}
                    role={role}
                    sessionUsername={username}
                    trainingTypes={typesQuery.data ?? []}
                    typesLoading={typesQuery.isLoading}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    )
}
