import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { useTraineeProfile } from '../hooks/useTraineeProfile'
import { useTrainersDirectoryQuery } from '../hooks/useTrainersDirectoryQuery'
import { useUpdateTraineeTrainers } from '../hooks/useUpdateTraineeTrainers'
import type { UserSearchRequest } from '../types/userSearch.types'

const MIN_TRAINERS_USER_MESSAGE = 'En az bir atanmış antrenörünüz olmalıdır.'

export function TraineeTrainersManagePage() {
  const { role, username: authUsername, isAuthenticated } = useAuth()
  const [searchText, setSearchText] = useState('')
  const debouncedUsername = useDebouncedValue(searchText.trim(), 400)
  const searchFilter: UserSearchRequest =
    debouncedUsername.length > 0
      ? { username: debouncedUsername }
      : {}

  const profileQuery = useTraineeProfile(
    role === 'TRAINEE' && authUsername ? authUsername : null,
  )
  const trainersResult = useTrainersDirectoryQuery(searchFilter)

  const [listError, setListError] = useState<string | null>(null)
  const mutation = useUpdateTraineeTrainers()

  const trainerUsernamesFromProfile =
    profileQuery.data?.trainers?.map((t) => t.username) ?? []

  const persistList = (nextUsernames: string[]) => {
    if (!profileQuery.data?.username) return
    setListError(null)
    mutation.mutate(
      {
        username: profileQuery.data.username,
        payload: { trainerUsernames: nextUsernames },
      },
      {
        onError: (err) => {
          setListError(resolveUserFacingApiErrorMessage(err, 'Liste kaydedilemedi.'))
        },
      },
    )
  }

  const addTrainer = (trainerUsername: string) => {
    const cur = trainerUsernamesFromProfile
    if (!trainerUsername.trim() || cur.includes(trainerUsername)) return
    persistList([...cur, trainerUsername])
  }

  const removeTrainer = (trainerUsername: string) => {
    const cur = trainerUsernamesFromProfile
    if (cur.length <= 1) {
      setListError(MIN_TRAINERS_USER_MESSAGE)
      return
    }
    persistList(cur.filter((u) => u !== trainerUsername))
  }

  if (!isAuthenticated || !authUsername || role !== 'TRAINEE') {
    return <Navigate to="/profil" replace />
  }

  if (profileQuery.isLoading) {
    return <p className="text-sm text-slate-400">Profil yükleniyor…</p>
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <p className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        Profil alınamadı.
      </p>
    )
  }

  const assigned = trainerUsernamesFromProfile
  const searchRows = trainersResult.data ?? []

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-white">Antrenör ara ve ekle</h2>
        <p className="mt-2 text-xs text-slate-500">
          Kullanıcı adı filtresi (içinde geçen metin); sonuçlarda uzmanlık alanı
          görüntülenir.
        </p>
        <label className="mt-4 grid gap-1 text-sm text-slate-200">
          Arama (kullanıcı adı)
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ornek: steve"
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
          />
        </label>

        {trainersResult.isLoading && (
          <p className="mt-4 text-sm text-slate-400">Aranıyor…</p>
        )}
        {trainersResult.isError && (
          <p className="mt-4 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            Arama yapılamadı.
          </p>
        )}
        {!trainersResult.isLoading && searchRows.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">Sonuç yok.</p>
        )}
        <ul className="mt-4 grid max-h-80 gap-2 overflow-y-auto">
          {searchRows.map((t) => {
            const disabled = assigned.includes(t.username) || mutation.isPending
            return (
              <li
                key={t.username}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-white">
                    {t.firstName} {t.lastName}
                  </p>
                  <p className="text-xs text-slate-500">@{t.username}</p>
                  <p className="mt-1 text-xs text-cyan-300">{t.specialization}</p>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => addTrainer(t.username)}
                  className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-40"
                >
                  Ekle
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="text-lg font-semibold text-white">Senin atanmış listen</h2>
        <p className="mt-2 text-xs text-slate-500">
          Değişiklikler anında{' '}
          <span className="font-mono text-slate-400">trainerUsernames</span> ile PUT
          yapılır.
        </p>
        {listError && (
          <p className="mt-3 whitespace-pre-line rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {listError}
          </p>
        )}
        {mutation.isPending && (
          <p className="mt-3 text-xs text-slate-400">Kaydediliyor…</p>
        )}
        {assigned.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">Listede antrenör yok.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {assigned.map((un) => {
              const info = profileQuery.data.trainers?.find(
                (tr) => tr.username === un,
              )
              return (
                <li
                  key={un}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">
                      {info
                        ? `${info.firstName} ${info.lastName}`
                        : un}
                    </p>
                    <p className="text-xs text-slate-500">@{un}</p>
                    {info && (
                      <p className="mt-1 text-xs text-cyan-300">
                        {info.specialization}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={mutation.isPending}
                    onClick={() => removeTrainer(un)}
                    className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/30 disabled:opacity-50"
                  >
                    Çıkar
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
