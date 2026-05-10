import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTrainingType,
  deleteTrainingType,
  searchTrainingTypes,
  updateTrainingType,
} from '../../workouts/services/trainingTypeService'
import type {
  TrainingTypeRequest,
  TrainingTypeResponse,
} from '../../workouts/types/workout.types'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog'
import { ApiError } from '../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'

export function AdminTrainingTypesPage() {
  const queryClient = useQueryClient()
  const [searchName, setSearchName] = useState('')
  const debounced = useDebouncedValue(searchName, 380)
  const searchBody = useMemo(
    () =>
      debounced.trim()
        ? { trainingName: debounced.trim() }
        : {},
    [debounced],
  )

  const listQuery = useQuery({
    queryKey: ['training-types', 'admin', searchBody] as const,
    queryFn: () => searchTrainingTypes(searchBody),
  })

  const [createName, setCreateName] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [editRow, setEditRow] = useState<TrainingTypeResponse | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [deleteRow, setDeleteRow] = useState<TrainingTypeResponse | null>(null)

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['training-types'] })
  }

  const createMutation = useMutation({
    mutationFn: (body: TrainingTypeRequest) => createTrainingType(body),
    onSuccess: () => {
      invalidate()
      setCreateName('')
      setCreateError(null)
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setCreateError(
          resolveUserFacingApiErrorMessage(
            err,
            'Tür oluşturulamadı.',
          ),
        )
        return
      }
      setCreateError('Tür oluşturulamadı.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (args: { id: number; body: TrainingTypeRequest }) =>
      updateTrainingType(args.id, args.body),
    onSuccess: () => {
      invalidate()
      setEditRow(null)
      setEditError(null)
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setEditError(
          resolveUserFacingApiErrorMessage(
            err,
            'Güncellenemedi.',
          ),
        )
        return
      }
      setEditError('Güncellenemedi.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTrainingType(id),
    onSuccess: () => {
      invalidate()
      setDeleteRow(null)
    },
  })

  const submitCreate = (e: FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    createMutation.mutate({ trainingName: createName.trim() })
  }

  const openEdit = (row: TrainingTypeResponse) => {
    setEditRow(row)
    setEditName(row.trainingTypeName)
    setEditError(null)
  }

  const submitEdit = (e: FormEvent) => {
    e.preventDefault()
    if (!editRow) return
    updateMutation.mutate({
      id: editRow.id,
      body: { trainingName: editName.trim() },
    })
  }

  const rows = listQuery.data ?? []

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Antrenman türleri</h1>
        <p className="mt-2 text-sm text-slate-400">
          Tür adlarını buradan yönetebilirsiniz; antrenör uzmanlıkları ve yeni antrenman
          kayıtları bu listeyi kullanır.
        </p>
      </header>

      <form
        className="max-w-xl space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5"
        onSubmit={submitCreate}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Yeni tür
        </h2>
        <label className="grid gap-1 text-sm text-slate-200">
          Ad
          <input
            required
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
        {createError && (
          <p className="text-sm text-rose-300">{createError}</p>
        )}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
        >
          {createMutation.isPending ? 'Ekleniyor…' : 'Ekle'}
        </button>
      </form>

      <label className="grid max-w-sm gap-1 text-sm text-slate-300">
        Ara
        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
        />
      </label>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
            <tr>
              <th className="border-b border-white/10 px-4 py-3">ID</th>
              <th className="border-b border-white/10 px-4 py-3">Ad</th>
              <th className="border-b border-white/10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {listQuery.isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-slate-400">
                  Yükleniyor…
                </td>
              </tr>
            )}
            {listQuery.isError && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-rose-300">
                  Veri alınamadı.
                </td>
              </tr>
            )}
            {!listQuery.isLoading &&
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-white">{row.trainingTypeName}</td>
                  <td className="flex flex-wrap justify-end gap-2 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="text-xs font-semibold text-cyan-300 hover:text-cyan-100"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteRow(row)}
                      className="text-xs font-semibold text-rose-300 hover:text-rose-100"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitEdit}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white">Türü güncelle</h2>
            <label className="mt-4 grid gap-1 text-sm text-slate-200">
              Ad
              <input
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white"
              />
            </label>
            {editError && (
              <p className="mt-3 text-sm text-rose-300">{editError}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300"
                onClick={() => setEditRow(null)}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
              >
                {updateMutation.isPending ? 'Kayıt…' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteRow)}
        title="Türü sil"
        description={
          deleteRow
            ? `“${deleteRow.trainingTypeName}” kalıcı olarak silinecek.`
            : ''
        }
        variant="danger"
        confirmLabel="Sil"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setDeleteRow(null)}
        onConfirm={() => deleteRow && deleteMutation.mutate(deleteRow.id)}
      />
    </div>
  )
}
