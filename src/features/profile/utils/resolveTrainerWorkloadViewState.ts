import { isTrainerWorkloadNotFoundError } from '../../../shared/utils/trainerWorkloadErrors'
import type { TrainerWorkloadSummary } from '../types/workload.types'

export type TrainerWorkloadViewState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: TrainerWorkloadSummary }
  | { kind: 'empty' }
  | { kind: 'error'; error: unknown }

interface TrainerWorkloadQuerySnapshot {
  isLoading: boolean
  isError: boolean
  error: unknown
  data: TrainerWorkloadSummary | undefined
}

export function resolveTrainerWorkloadViewState(
  query: TrainerWorkloadQuerySnapshot,
): TrainerWorkloadViewState {
  if (query.isLoading) {
    return { kind: 'loading' }
  }
  if (query.data) {
    return { kind: 'ready', data: query.data }
  }
  if (query.isError && isTrainerWorkloadNotFoundError(query.error)) {
    return { kind: 'empty' }
  }
  if (query.isError) {
    return { kind: 'error', error: query.error }
  }
  return { kind: 'error', error: new Error('Unexpected workload query state') }
}
