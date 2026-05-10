import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CredentialRevealCard } from '../../components/CredentialRevealCard'
import {
  createTrainerByAdmin,
  type TrainerCreateRequest,
} from '../../services/adminUserService'
import { getTrainingTypes } from '../../../workouts/services/trainingTypeService'
import type { RegisterResponse } from '../../../auth/types/auth.types'
import { ApiError } from '../../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../../shared/utils/resolveUserFacingApiError'

export function AdminCreateTrainerPage() {
  const typesQuery = useQuery({
    queryKey: ['training-types', 'all'],
    queryFn: getTrainingTypes,
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [specializationId, setSpecializationId] = useState(0)

  const [result, setResult] = useState<RegisterResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const firstTypeId = useMemo(
    () => typesQuery.data?.[0]?.id ?? 0,
    [typesQuery.data],
  )

  const mutation = useMutation({
    mutationFn: createTrainerByAdmin,
    onSuccess: (data) => {
      setResult(data)
      setFirstName('')
      setLastName('')
      setEmail('')
      setSpecializationId(firstTypeId)
      setError(null)
    },
    onError: (err: unknown) => {
      setResult(null)
      if (err instanceof ApiError) {
        setError(
          resolveUserFacingApiErrorMessage(
            err,
            'Antrenör oluşturulamadı.',
          ),
        )
        return
      }
      setError('Antrenör oluşturulamadı.')
    },
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const sid = specializationId || firstTypeId
    if (!sid) {
      setError('Önce sistemde en az bir antrenman türü olmalı.')
      return
    }
    const payload: TrainerCreateRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      specializationId: sid,
    }
    mutation.mutate(payload)
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin"
          className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
        >
          ← Panele dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Yeni antrenör (admin)
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Uzmanlık alanı olarak mevcut antrenman türlerinden biri seçilir.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,minmax(0,320px)]">
        <form
          className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          onSubmit={submit}
        >
          <label className="grid gap-1 text-sm text-slate-200">
            Ad
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            Soyad
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            E-posta
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            Uzmanlık (antrenman türü)
            <select
              required
              disabled={typesQuery.isLoading || !typesQuery.data?.length}
              value={(specializationId || firstTypeId) || ''}
              onChange={(e) =>
                setSpecializationId(Number(e.target.value))
              }
              className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
            >
              {typesQuery.isLoading ? (
                <option value="">Yükleniyor…</option>
              ) : null}
              {(typesQuery.data ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.trainingTypeName}
                </option>
              ))}
            </select>
          </label>
          {error && (
            <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending || typesQuery.isLoading}
            className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {mutation.isPending ? 'Gönderiliyor…' : 'Antrenör oluştur'}
          </button>
        </form>
        {result ? <CredentialRevealCard credentials={result} /> : null}
      </div>
    </div>
  )
}
