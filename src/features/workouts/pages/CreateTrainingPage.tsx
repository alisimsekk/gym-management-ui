import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useTraineesDirectoryQuery } from '../../profile/hooks/useTraineesDirectoryQuery'
import { useTrainersDirectoryQuery } from '../../profile/hooks/useTrainersDirectoryQuery'
import { filterActiveUsers } from '../../profile/utils/filterActiveDirectoryUsers'
import { TrainingDurationField } from '../components/TrainingDurationField'
import { TrainingDateTimePickerField } from '../components/TrainingDateTimePickerField'
import { DEFAULT_TRAINING_DURATION_MINUTES } from '../constants/trainingSchedule.constants'
import { useTrainingTypesQuery } from '../hooks/useTrainingTypesQuery'
import { useCreateTrainingMutation } from '../hooks/useCreateTrainingMutation'
import { ApiError } from '../../../shared/api/apiError'
import { APP_BRAND_NAME } from '../../../shared/constants/brand'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'

export function CreateTrainingPage() {
    const navigate = useNavigate()
    const { role, username, isAuthenticated } = useAuth()
    const typesQuery = useTrainingTypesQuery()
    const createMutation = useCreateTrainingMutation()

    const isAdmin = role === 'ADMIN'
    const traineesCanLoad = Boolean(
        isAuthenticated && (role === 'TRAINER' || isAdmin),
    )
    const trainersCanLoad = Boolean(
        isAuthenticated && (role === 'TRAINEE' || isAdmin),
    )

    const traineesDirectory = useTraineesDirectoryQuery(
        {},
        { enabled: traineesCanLoad },
    )
    const trainersDirectory = useTrainersDirectoryQuery(
        {},
        { enabled: trainersCanLoad },
    )

    const activeTrainees = useMemo(
        () => filterActiveUsers(traineesDirectory.data),
        [traineesDirectory.data],
    )
    const activeTrainers = useMemo(
        () => filterActiveUsers(trainersDirectory.data),
        [trainersDirectory.data],
    )

    const [trainingName, setTrainingName] = useState('')
    const [trainingDateTime, setTrainingDateTime] = useState<string | null>(null)
    const [trainingDuration, setTrainingDuration] = useState(
        DEFAULT_TRAINING_DURATION_MINUTES,
    )
    const [trainingTypeId, setTrainingTypeId] = useState<number>(0)
    const [selectedPeerUsername, setSelectedPeerUsername] = useState('')
    const [adminTraineeUsername, setAdminTraineeUsername] = useState('')
    const [adminTrainerUsername, setAdminTrainerUsername] = useState('')
    const [error, setError] = useState<string | null>(null)

    const isTrainee = role === 'TRAINEE'
    const isTrainer = role === 'TRAINER'

    const resolvedParticipants = useMemo(() => {
        if (isAdmin) {
            return {
                traineeUsername: adminTraineeUsername.trim(),
                trainerUsername: adminTrainerUsername.trim(),
            }
        }
        const peer = selectedPeerUsername.trim()
        if (isTrainee && username) {
            return { traineeUsername: username, trainerUsername: peer }
        }
        if (isTrainer && username) {
            return { traineeUsername: peer, trainerUsername: username }
        }
        return { traineeUsername: '', trainerUsername: '' }
    }, [
        adminTraineeUsername,
        adminTrainerUsername,
        isAdmin,
        isTrainee,
        isTrainer,
        selectedPeerUsername,
        username,
    ])

    useEffect(() => {
        const traineesReady =
            traineesDirectory.data !== undefined && !traineesDirectory.isLoading
        const trainersReady =
            trainersDirectory.data !== undefined && !trainersDirectory.isLoading

        if ((isTrainer || isAdmin) && traineesReady) {
            if (
                isTrainer &&
                selectedPeerUsername &&
                !activeTrainees.some((t) => t.username === selectedPeerUsername)
            ) {
                setSelectedPeerUsername('')
            }
            if (
                isAdmin &&
                adminTraineeUsername &&
                !activeTrainees.some((t) => t.username === adminTraineeUsername)
            ) {
                setAdminTraineeUsername('')
            }
        }

        if ((isTrainee || isAdmin) && trainersReady) {
            if (
                isTrainee &&
                selectedPeerUsername &&
                !activeTrainers.some((t) => t.username === selectedPeerUsername)
            ) {
                setSelectedPeerUsername('')
            }
            if (
                isAdmin &&
                adminTrainerUsername &&
                !activeTrainers.some((t) => t.username === adminTrainerUsername)
            ) {
                setAdminTrainerUsername('')
            }
        }
    }, [
        activeTrainees,
        activeTrainers,
        adminTrainerUsername,
        adminTraineeUsername,
        isAdmin,
        isTrainer,
        isTrainee,
        selectedPeerUsername,
        traineesDirectory.data,
        traineesDirectory.isLoading,
        trainersDirectory.data,
        trainersDirectory.isLoading,
    ])

    if (!isAuthenticated || !role) {
        return <Navigate to="/auth/login" replace />
    }
    if (role !== 'ADMIN' && !username) {
        return <Navigate to="/auth/login" replace />
    }

    const handleParticipantChange = (updater: () => void) => {
        updater()
        setTrainingDateTime(null)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        if (!trainingTypeId) {
            setError('Antrenman türü seçin.')
            return
        }

        const { traineeUsername, trainerUsername } = resolvedParticipants
        if (!traineeUsername || !trainerUsername) {
            setError(
                isAdmin
                    ? 'Trainee ve antrenör kullanıcılarını seçin.'
                    : isTrainee
                        ? 'Listeden bir antrenör seçin.'
                        : 'Listeden bir trainee seçin.',
            )
            return
        }

        if (!trainingDateTime) {
            setError('Müsait bir tarih ve saat seçin.')
            return
        }

        createMutation.mutate(
            {
                traineeUsername,
                trainerUsername,
                trainingName: trainingName.trim(),
                trainingDateTime,
                trainingDuration,
                trainingTypeId,
            },
            {
                onSuccess: () =>
                    isAdmin
                        ? navigate('/admin/antrenmanlar')
                        : navigate('/profil/antrenmanlar'),
                onError: (err) => {
                    if (err instanceof ApiError) {
                        setError(
                            resolveUserFacingApiErrorMessage(
                                err,
                                'Antrenman oluşturulamadı.',
                            ),
                        )
                        return
                    }
                    setError('Antrenman oluşturulamadı.')
                },
            },
        )
    }

    const trainersSelectBusy =
        (isTrainee || isAdmin) && trainersDirectory.isLoading
    const traineesSelectBusy =
        (isTrainer || isAdmin) && traineesDirectory.isLoading

    const traineeDirReady =
        traineesDirectory.data !== undefined && !traineesDirectory.isLoading
    const trainerDirReady =
        trainersDirectory.data !== undefined && !trainersDirectory.isLoading

    const noActiveTraineesToPick =
        (isTrainer || isAdmin) &&
        traineeDirReady &&
        activeTrainees.length === 0 &&
        !traineesDirectory.isError
    const noActiveTrainersToPick =
        (isTrainee || isAdmin) &&
        trainerDirReady &&
        activeTrainers.length === 0 &&
        !trainersDirectory.isError

    const participantsReady =
        Boolean(resolvedParticipants.traineeUsername) &&
        Boolean(resolvedParticipants.trainerUsername)

    return (
        <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
            <p className="text-xs uppercase tracking-widest text-cyan-300">
                {APP_BRAND_NAME}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">Antrenman oluştur</h1>
            <p className="mt-2 text-sm text-slate-400">
                {isTrainee &&
                    'Trainee olarak sen otomatik seçilirsin; antrenörü ve müsait saati seç.'}
                {isTrainer &&
                    'Trainer olarak sen antrenör olarak otomatik seçilirsin; trainee ve müsait saati seç.'}
                {isAdmin &&
                    'Admin olarak öğrenci-antrenör çiftini ve müsait saati seç.'}
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-1 text-sm text-slate-200">
                    Antrenman adı
                    <input
                        required
                        value={trainingName}
                        onChange={(e) => setTrainingName(e.target.value)}
                        className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                    />
                </label>

                <label className="grid gap-1 text-sm text-slate-200">
                    Antrenman türü
                    <select
                        required
                        disabled={typesQuery.isLoading || !typesQuery.data?.length}
                        value={trainingTypeId || ''}
                        onChange={(e) => setTrainingTypeId(Number(e.target.value))}
                        className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                    >
                        <option value="">Seçin</option>
                        {(typesQuery.data ?? []).map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.trainingTypeName}
                            </option>
                        ))}
                    </select>
                </label>

                {isTrainee && (
                    <div className="grid gap-1">
                        <label className="grid gap-1 text-sm text-slate-200">
                            Antrenör seçimi
                            <select
                                required
                                disabled={trainersSelectBusy}
                                value={selectedPeerUsername}
                                onChange={(e) =>
                                    handleParticipantChange(() =>
                                        setSelectedPeerUsername(e.target.value),
                                    )
                                }
                                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                            >
                                <option value="">
                                    {trainersDirectory.isLoading
                                        ? 'Antrenörler yükleniyor…'
                                        : 'Antrenör seç'}
                                </option>
                                {activeTrainers.map((t) => (
                                    <option key={t.username} value={t.username}>
                                        {t.firstName} {t.lastName} — {t.specialization}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {noActiveTrainersToPick && (
                            <p className="text-xs text-amber-200/90">
                                Etkin antrenör bulunmuyor; yeni antrenman oluşturulamaz.
                            </p>
                        )}
                    </div>
                )}

                {isTrainer && (
                    <div className="grid gap-1">
                        <label className="grid gap-1 text-sm text-slate-200">
                            Trainee seçimi
                            <select
                                required
                                disabled={traineesSelectBusy}
                                value={selectedPeerUsername}
                                onChange={(e) =>
                                    handleParticipantChange(() =>
                                        setSelectedPeerUsername(e.target.value),
                                    )
                                }
                                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                            >
                                <option value="">
                                    {traineesDirectory.isLoading
                                        ? 'Trainee listesi yükleniyor…'
                                        : 'Trainee seç'}
                                </option>
                                {activeTrainees.map((t) => (
                                    <option key={t.username} value={t.username}>
                                        {t.firstName} {t.lastName}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {noActiveTraineesToPick && (
                            <p className="text-xs text-amber-200/90">
                                Etkin öğrenci bulunmuyor; yeni antrenman oluşturulamaz.
                            </p>
                        )}
                    </div>
                )}

                {isAdmin && (
                    <>
                        <div className="grid gap-1">
                            <label className="grid gap-1 text-sm text-slate-200">
                                Öğrenci (trainee)
                                <select
                                    required
                                    disabled={traineesSelectBusy}
                                    value={adminTraineeUsername}
                                    onChange={(e) =>
                                        handleParticipantChange(() =>
                                            setAdminTraineeUsername(e.target.value),
                                        )
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                                >
                                    <option value="">
                                        {traineesDirectory.isLoading
                                            ? 'Liste yükleniyor…'
                                            : 'Seç'}
                                    </option>
                                    {activeTrainees.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName} — @{t.username}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {noActiveTraineesToPick && (
                                <p className="text-xs text-amber-200/90">
                                    Etkin öğrenci yok; önce kullanıcı hesaplarını etkinleştirin.
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1">
                            <label className="grid gap-1 text-sm text-slate-200">
                                Antrenör
                                <select
                                    required
                                    disabled={trainersSelectBusy}
                                    value={adminTrainerUsername}
                                    onChange={(e) =>
                                        handleParticipantChange(() =>
                                            setAdminTrainerUsername(e.target.value),
                                        )
                                    }
                                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                                >
                                    <option value="">
                                        {trainersDirectory.isLoading
                                            ? 'Liste yükleniyor…'
                                            : 'Seç'}
                                    </option>
                                    {activeTrainers.map((t) => (
                                        <option key={t.username} value={t.username}>
                                            {t.firstName} {t.lastName} — @{t.username}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {noActiveTrainersToPick && (
                                <p className="text-xs text-amber-200/90">
                                    Etkin antrenör yok; önce kullanıcı hesaplarını etkinleştirin.
                                </p>
                            )}
                        </div>
                    </>
                )}

                <TrainingDateTimePickerField
                    key={`${resolvedParticipants.trainerUsername}-${resolvedParticipants.traineeUsername}`}
                    trainerUsername={resolvedParticipants.trainerUsername}
                    traineeUsername={resolvedParticipants.traineeUsername}
                    value={trainingDateTime}
                    disabled={!participantsReady || createMutation.isPending}
                    onChange={setTrainingDateTime}
                />

                <TrainingDurationField
                    value={trainingDuration}
                    onChange={setTrainingDuration}
                    disabled={createMutation.isPending}
                />

                {error && (
                    <p className="whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={
                            createMutation.isPending ||
                            !trainingDateTime ||
                            (isTrainee &&
                                (trainersDirectory.isError || noActiveTrainersToPick)) ||
                            (isTrainer &&
                                (traineesDirectory.isError || noActiveTraineesToPick)) ||
                            (isAdmin &&
                                (trainersDirectory.isError ||
                                    traineesDirectory.isError ||
                                    noActiveTraineesToPick ||
                                    noActiveTrainersToPick))
                        }
                        className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                    >
                        {createMutation.isPending ? 'Oluşturuluyor…' : 'Oluştur'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-slate-200 hover:border-cyan-300"
                    >
                        Vazgeç
                    </button>
                </div>
            </form>
        </main>
    )
}
