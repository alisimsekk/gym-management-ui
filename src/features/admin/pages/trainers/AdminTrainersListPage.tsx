import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { searchTrainersDirectory } from '../../../profile/services/userDirectoryService'
import type { UserSearchRequest } from '../../../profile/types/userSearch.types'
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue'

const searchKey = (f: UserSearchRequest) =>
  ['admin', 'trainers', 'directory', f] as const

export function AdminTrainersListPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  const debounced = useDebouncedValue(
    { firstName, lastName, username },
    380,
  )

  const sanitized = useMemo((): UserSearchRequest => {
    const f = debounced.firstName.trim()
    const l = debounced.lastName.trim()
    const u = debounced.username.trim()
    return {
      ...(f ? { firstName: f } : {}),
      ...(l ? { lastName: l } : {}),
      ...(u ? { username: u } : {}),
    }
  }, [debounced])

  const directoryQuery = useQuery({
    queryKey: searchKey(sanitized),
    queryFn: () => searchTrainersDirectory(sanitized),
  })

  const rows = directoryQuery.data ?? []

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Antrenörler</h1>
          <p className="mt-2 text-sm text-slate-400">
            Boş arama ile tüm kayıtlar listelenir (sunucuya bağlıdır).
          </p>
        </div>
      </header>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:grid-cols-3">
        <label className="grid gap-1 text-xs text-slate-400">
          Ad
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          Soyad
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          Kullanıcı adı
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900/90 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="border-b border-white/10 px-4 py-3">Kullanıcı</th>
              <th className="border-b border-white/10 px-4 py-3">Uzmanlık</th>
              <th className="border-b border-white/10 px-4 py-3">Durum</th>
              <th className="border-b border-white/10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {directoryQuery.isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Yükleniyor…
                </td>
              </tr>
            )}
            {directoryQuery.isError && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-rose-300">
                  Liste alınamadı.
                </td>
              </tr>
            )}
            {!directoryQuery.isLoading &&
              !directoryQuery.isError &&
              rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Kayıt yok.
                </td>
              </tr>
            )}
            {rows.map((t) => (
              <tr
                key={t.username}
                className="border-b border-white/5 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 text-white">
                  <div className="font-medium">
                    {t.firstName} {t.lastName}
                  </div>
                  <div className="font-mono text-xs text-slate-500">
                    @{t.username}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{t.specialization}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      t.isActive
                        ? 'rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200'
                        : 'rounded-full bg-slate-500/20 px-2 py-1 text-xs text-slate-400'
                    }
                  >
                    {t.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/antrenorler/${encodeURIComponent(t.username)}`}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-100"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
