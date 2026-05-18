import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserRole } from '../../auth/types/auth.types'
import type {
    TraineeProfileResponse,
    TrainerProfileResponse,
} from '../../profile/types/profile.types'
import { useTraineesDirectoryQuery } from '../../profile/hooks/useTraineesDirectoryQuery'
import { useTrainersDirectoryQuery } from '../../profile/hooks/useTrainersDirectoryQuery'
import { filterActiveUsers } from '../../profile/utils/filterActiveDirectoryUsers'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import type { TrainingResponse } from '../types/workout.types'
import type { TrainingTypeResponse } from '../types/workout.types'
import { useUpdateTrainingMutation } from '../hooks/useUpdateTrainingMutation'
import { TrainingDurationField } from './TrainingDurationField'
import { TrainingDateTimePickerField } from './TrainingDateTimePickerField'
import { DEFAULT_TRAINING_DURATION_MINUTES } from '../constants/trainingSchedule.constants'
import { ApiError } from '../../../shared/api/apiError'

interface TrainingEditModalProps {
    training: TrainingResponse
    role: UserRole
    sessionUsername: string
    trainingTypes: TrainingTypeResponse[]
    typesLoading: boolean
    onClose: () => void
}

interface FormState {
    trainingName: string
    trainingDateTime: string | null
    trainingDuration: number
    trainingTypeId: number
    traineeUsername: string
    trainerUsername: string
}

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
    const parts = displayName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return { firstName: '', lastName: '' }
    if (parts.length === 1) return { firstName: parts[0], lastName: '' }
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
    }
}

function trainersWithCurrent(
    list: TrainerProfileResponse[] | undefined,
    training: TrainingResponse,
): TrainerProfileResponse[] {
    const base = list ?? []
    const u = training.trainerUsername
    if (!u || base.some((t) => t.username === u)) return base
    const { firstName, lastName } = splitDisplayName(training.trainerName)
    const synthetic: TrainerProfileResponse = {
        id: 0,
        username: u,
        firstName,
        lastName,
        email: '',
        specialization: '-',
        isActive: true,
        trainees: [],
    }
    return [synthetic, ...base]
}

function traineesWithCurrent(
    list: TraineeProfileResponse[] | undefined,
    training: TrainingResponse,
): TraineeProfileResponse[] {
    const base = list ?? []
    const u = training.traineeUsername
    if (!u || base.some((t) => t.username === u)) return base
    const { firstName, lastName } = splitDisplayName(training.traineeName)
    const synthetic: TraineeProfileResponse = {
        id: 0,
        username: u,
        firstName,
        lastName,
        email: '',
        dateOfBirth: undefined,
        address: undefined,
        isActive: true,
        trainers: [],
    }
    return [synthetic, ...base]
}

export function TrainingEditModal({
                                      training,
                                      role,
                                      sessionUsername,
                                      trainingTypes,
                                      typesLoading,
                                      onClose,
                                  }: TrainingEditModalProps) {
    const isTrainee = role === 'TRAINEE'
    const isTrainer = role === 'TRAINER'
    const isAdmin = role === 'ADMIN'

    const trainersQuery = useTrainersDirectoryQuery(
        {},
        { enabled: isTrainee || isAdmin },
    )
    const traineesQuery = useTraineesDirectoryQuery(
        {},
        { enabled: isTrainer || isAdmin },
    )

    const activeTrainerDirectory = useMemo(
        () => filterActiveUsers(trainersQuery.data),
        [trainersQuery.data],
    )
    const activeTraineeDirectory = useMemo(
        () => filterActiveUsers(traineesQuery.data),
        [traineesQuery.data],
    )

    const trainerOptions = useMemo(
        () => trainersWithCurrent(activeTrainerDirectory, training),
        [activeTrainerDirectory, training],
    )
    const traineeOptions = useMemo(
        () => traineesWithCurrent(activeTraineeDirectory, training),
        [activeTraineeDirectory, training],
    )

    const mutation = useUpdateTrainingMutation()
    const [error, setError] = useState<string | null>(null)

    const resolvedTypeId =
        trainingTypes.find((t) => t.trainingTypeName === training.trainingType)
            ?.id ?? 0

    const [form, setForm] = useState<FormState>({
        trainingName: training.trainingName,
        trainingDateTime: training.trainingDateTime,
        trainingDuration: Math.min(training.duration, 45),
        trainingTypeId: resolvedTypeId,
        traineeUsername: training.traineeUsername,
        trainerUsername: training.trainerUsername,
    })

    useEffect(() => {
        const tid =
            trainingTypes.find((t) => t.trainingTypeName === training.trainingType)
                ?.id ?? 0
        /* eslint-disable-next-line react-hooks/set-state-in-effect -- seçili antrenman değişimi */
        setForm({
            trainingName: training.trainingName,
            trainingDateTime: training.trainingDateTime,
            trainingDuration: Math.min(training.duration, 45),
            trainingTypeId: tid,
            traineeUsername: training.traineeUsername,
            trainerUsername: training.trainerUsername,
        })
    }, [training, trainingTypes])

    const lockTrainee = isTrainee && !isAdmin
    const lockTrainer = isTrainer && !isAdmin

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        const tid = form.trainingTypeId
        if (!tid) {
            setError('Antrenman türü seçilmeli.')
            return
        }

        const traineeU =
            lockTrainee ? sessionUsername : form.traineeUsername.trim()
        const trainerU =
            lockTrainer ? sessionUsername : form.trainerUsername.trim()

        if (!form.trainingDateTime) {
            setError('Müsait bir tarih ve saat seçin.')
            return
        }

        if (!traineeU || !trainerU) {
            if (isAdmin) {
                setError('Öğrenci ve antrenör kullanıcı adlarını seçin.')
            } else if (isTrainee) {
                setError('Bir antrenör seçmelisin.')
            } else {
                setError('Bir trainee seçmelisin.')
            }
            return
        }

        mutation.mutate(
            {
                id: training.id,
                payload: {
                    trainingName: form.trainingName,
                    traineeUsername: traineeU,
                    trainerUsername: trainerU,
                    trainingTypeId: tid,
                    trainingDateTime: form.trainingDateTime,
                    trainingDuration: form.trainingDuration,
                },
            },
            {
                onSuccess: () => onClose(),
                onError: (err) => {
                    if (err instanceof ApiError) {
                        setError(
                            resolveUserFacingApiErrorMessage(err, 'Güncelleme başarısız.'),
                        )
                        return
                    }
                    setError('Güncelleme başarısız.')
                },
            },
        )
    }

    const trainerSelectBusy =
        (isTrainee || isAdmin) && trainersQuery.isLoading
    const traineeSelectBusy =
        (isTrainer || isAdmin) && traineesQuery.isLoading

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white">
                        Antrenman güncelle
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:border-cyan-300"
                    >
                        Kapat
                    </button>
                </div>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <label className="grid gap-1 text-sm text-slate-200">
                        Antrenman adı
                        <input
                            required
                            value={form.trainingName}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, trainingName: e.target.value }))
                            }
                            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                        />
                    </label>

                    <TrainingDateTimePickerField
                        key={`${form.trainerUsername}-${form.traineeUsername}-${training.id}`}
                        trainerUsername={form.trainerUsername}
                        traineeUsername={form.traineeUsername}
                        value={form.trainingDateTime}
                        disabled={mutation.isPending}
                        excludeTrainingId={training.id}
                        allowCurrentValue={training.trainingDateTime}
                        onChange={(iso) =>
                            setForm((f) => ({ ...f, trainingDateTime: iso }))
                        }
                    />

                    <TrainingDurationField
                        value={form.trainingDuration || DEFAULT_TRAINING_DURATION_MINUTES}
                        onChange={(duration) =>
                            setForm((f) => ({ ...f, trainingDuration: duration }))
                        }
                        disabled={mutation.isPending}
                    />

                    <label className="grid gap-1 text-sm text-slate-200">
                        Antrenman türü
                        <select
                            required
                            disabled={typesLoading || trainingTypes.length === 0}
                            value={form.trainingTypeId || ''}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    trainingTypeId: Number(e.target.value),
                                }))
                            }
                            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                        >
                            <option value="">Seçin</option>
                            {trainingTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.trainingTypeName}
                                </option>
                            ))}
                        </select>
                    </label>

                    {isAdmin && (
                        <>
                            <label className="grid gap-1 text-sm text-slate-200">
                                Trainee seçimi
                                <select
                                    required
                                    disabled={traineeSelectBusy}
                                    value={form.traineeUsername}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            traineeUsername: e.target.value,
                                        }))
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-60"
                                >
                                    <option value="">
                                        {traineesQuery.isLoading ? 'Liste yükleniyor…' : 'Trainee seç'}
                                    </option>
                                    {traineeOptions.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-1 text-sm text-slate-200">
                                Antrenör seçimi
                                <select
                                    required
                                    disabled={trainerSelectBusy}
                                    value={form.trainerUsername}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            trainerUsername: e.target.value,
                                        }))
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-60"
                                >
                                    <option value="">
                                        {trainersQuery.isLoading
                                            ? 'Antrenörler yükleniyor…'
                                            : 'Antrenör seç'}
                                    </option>
                                    {trainerOptions.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName} — {t.specialization}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </>
                    )}

                    {lockTrainee && (
                        <>
                            <div className="grid gap-1 text-sm text-slate-200">
                                <span>Trainee</span>
                                <input
                                    readOnly
                                    tabIndex={-1}
                                    value={sessionUsername}
                                    className="cursor-default rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-400"
                                />
                            </div>
                            <label className="grid gap-1 text-sm text-slate-200">
                                Antrenör seçimi
                                <select
                                    required
                                    disabled={trainerSelectBusy}
                                    value={form.trainerUsername}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            trainerUsername: e.target.value,
                                        }))
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-60"
                                >
                                    <option value="">
                                        {trainersQuery.isLoading
                                            ? 'Antrenörler yükleniyor…'
                                            : 'Antrenör seç'}
                                    </option>
                                    {trainerOptions.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName} — {t.specialization}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {trainersQuery.isError && (
                                <p className="text-xs text-rose-300">
                                    Antrenör listesi alınamadı; mevcut antrenörü seçili tutuyorsun.
                                </p>
                            )}
                        </>
                    )}

                    {lockTrainer && (
                        <>
                            <div className="grid gap-1 text-sm text-slate-200">
                                <span>Antrenör</span>
                                <input
                                    readOnly
                                    tabIndex={-1}
                                    value={sessionUsername}
                                    className="cursor-default rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-400"
                                />
                            </div>
                            <label className="grid gap-1 text-sm text-slate-200">
                                Trainee seçimi
                                <select
                                    required
                                    disabled={traineeSelectBusy}
                                    value={form.traineeUsername}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            traineeUsername: e.target.value,
                                        }))
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300 disabled:opacity-60"
                                >
                                    <option value="">
                                        {traineesQuery.isLoading
                                            ? 'Trainee listesi yükleniyor…'
                                            : 'Trainee seç'}
                                    </option>
                                    {traineeOptions.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {traineesQuery.isError && (
                                <p className="text-xs text-rose-300">
                                    Liste alınamadı; mevcut trainee seçili tutulabilir.
                                </p>
                            )}
                        </>
                    )}

                    {error && (
                        <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                        >
                            {mutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-white/20 px-5 py-2 text-sm text-slate-200 hover:border-cyan-300"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
