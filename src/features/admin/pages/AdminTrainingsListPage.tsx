import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { deleteTraining, searchTrainings } from '../../workouts/services/trainingService'
import type {
  TrainingResponse,
  TrainingSearchRequest,
} from '../../workouts/types/workout.types'
import { getTrainingTypes } from '../../workouts/services/trainingTypeService'
import { useAdminAllTrainingsQuery, adminAllTrainingsKey } from '../hooks/useAdminAllTrainingsQuery'
import { TrainingEditModal } from '../../workouts/components/TrainingEditModal'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog'

type ViewMode = 'all' | 'search'

interface SearchFormState {
  traineeUsername: string
  trainerUsername: string
  trainerName: string
  traineeName: string
  trainingTypeName: string
  periodFrom: string
  periodTo: string
}

function toSearchPayload(form: SearchFormState): TrainingSearchRequest {
  const p: TrainingSearchRequest = {}
  const tv = form.traineeUsername.trim()
  const tr = form.trainerUsername.trim()
  const tn = form.trainerName.trim()
  const tn2 = form.traineeName.trim()
  const tt = form.trainingTypeName.trim()
  const pf = form.periodFrom.trim()
  const pt = form.periodTo.trim()
  if (tv) p.traineeUsername = tv
  if (tr) p.trainerUsername = tr
  if (tn) p.trainerName = tn
  if (tn2) p.traineeName = tn2
  if (tt) p.trainingTypeName = tt
  if (pf) p.periodFrom = pf
  if (pt) p.periodTo = pt
  return p
}

export function AdminTrainingsListPage() {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<ViewMode>('all')
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    traineeUsername: '',
    trainerUsername: '',
    trainerName: '',
    traineeName: '',
    trainingTypeName: '',
    periodFrom: '',
    periodTo: '',
  })
  const debouncedSearch = useDebouncedValue(searchForm, 400)
  const searchPayload = useMemo(
    () => toSearchPayload(debouncedSearch),
    [debouncedSearch],
  )

  const allQuery = useAdminAllTrainingsQuery()

  const searchQuery = useQuery({
    queryKey: ['trainings', 'admin', 'search', searchPayload] as const,
    queryFn: () => searchTrainings(searchPayload),
    enabled: mode === 'search',
  })

  const typesQuery = useQuery({
    queryKey: ['training-types', 'all'],
    queryFn: getTrainingTypes,
  })

  const [editing, setEditing] = useState<TrainingResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TrainingResponse | null>(null)

  const invalidateAll = (): void => {
    void queryClient.invalidateQueries({ queryKey: adminAllTrainingsKey })
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTraining(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })

  const rows =
    mode === 'all'
      ? (allQuery.data ?? [])
      : (searchQuery.data ?? [])
  const loading =
    mode === 'all' ? allQuery.isLoading : searchQuery.isLoading
  const isError =
    mode === 'all' ? allQuery.isError : searchQuery.isError

  const runSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    setMode('search')
    void searchQuery.refetch()
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Antrenmanlar</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Kayıtlı tüm seansları tek ekranda yönetin. “Filtreli arama” ile tarih,
            isim veya kullanıcı adına göre daraltabilirsiniz.
          </p>
        </div>
        <Link
          to="/admin/antrenmanlar/yeni"
          className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Yeni antrenman
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('all')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === 'all'
              ? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/50'
              : 'border border-white/15 text-slate-400 hover:bg-white/5'
          }`}
        >
          Tümü
        </button>
        <button
          type="button"
          onClick={() => setMode('search')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === 'search'
              ? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/50'
              : 'border border-white/15 text-slate-400 hover:bg-white/5'
          }`}
        >
          Filtreli arama
        </button>
      </div>

      {mode === 'search' && (
        <form
          onSubmit={runSearchSubmit}
          className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(
            [
              ['traineeUsername', 'Öğrenci kullanıcı adı'],
              ['trainerUsername', 'Antrenör kullanıcı adı'],
              ['traineeName', 'Öğrenci adı'],
              ['trainerName', 'Antrenör adı'],
              ['trainingTypeName', 'Antrenman türü adı'],
              ['periodFrom', 'Başlangıç (yyyy-mm-dd)'],
              ['periodTo', 'Bitiş (yyyy-mm-dd)'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="grid gap-1 text-xs text-slate-400">
              {label}
              <input
                value={searchForm[key]}
                onChange={(e) =>
                  setSearchForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                type={key === 'periodFrom' || key === 'periodTo' ? 'date' : 'text'}
                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
          ))}
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-cyan-200 hover:bg-white/10"
            >
              Aramayı uygula
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
            <tr>
              <th className="border-b border-white/10 px-4 py-3">Tarih</th>
              <th className="border-b border-white/10 px-4 py-3">Antrenman Adı</th>
              <th className="border-b border-white/10 px-4 py-3">Öğrenci-Antrenör</th>
              <th className="border-b border-white/10 px-4 py-3">Süre</th>
              <th className="border-b border-white/10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Yükleniyor…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-rose-300">
                  Liste alınamadı.
                </td>
              </tr>
            )}
            {!loading && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Kayıt yok.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((t) => (
                <tr
                  key={`${t.id}-${t.trainingDate}`}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {String(t.trainingDate).slice(0, 10)}
                  </td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-white">
                    {t.trainingName}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    <span className="block text-white/90">{t.trainingType}</span>
                    <span className="font-mono">@{t.traineeUsername}</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span className="font-mono">@{t.trainerUsername}</span>
                  </td>
                  <td className="px-4 py-3">{t.duration} dk</td>
                  <td className="flex flex-wrap justify-end gap-2 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(t)}
                      className="text-xs font-semibold text-cyan-300 hover:text-cyan-100"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(t)}
                      className="text-xs font-semibold text-rose-300 hover:text-rose-100"
                      disabled={deleteMutation.isPending}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <TrainingEditModal
          training={editing}
          role="ADMIN"
          sessionUsername=""
          trainingTypes={typesQuery.data ?? []}
          typesLoading={typesQuery.isLoading}
          onClose={() => {
            setEditing(null)
            invalidateAll()
            void searchQuery.refetch()
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Antrenmanı sil"
        description={
          deleteTarget
            ? `“${deleteTarget.trainingName}” silinecek.`
            : ''
        }
        variant="danger"
        confirmLabel="Sil"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget &&
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              setDeleteTarget(null)
            },
          })
        }
      />
    </div>
  )
}
