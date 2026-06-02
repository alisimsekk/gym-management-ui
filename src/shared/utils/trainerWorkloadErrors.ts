import { ApiError } from '../api/apiError'

export const TRAINER_WORKLOAD_NOT_FOUND_CODE = '4002'

export function isTrainerWorkloadNotFoundError(err: unknown): boolean {
  if (err instanceof ApiError && err.errorCode === TRAINER_WORKLOAD_NOT_FOUND_CODE) {
    return true
  }
  if (
    err instanceof ApiError &&
    err.status === 404 &&
    /^No workload data available for trainer\.?$/i.test(err.message.trim())
  ) {
    return true
  }
  return false
}

export function trainerWorkloadQueryRetry(
  failureCount: number,
  error: unknown,
): boolean {
  return !isTrainerWorkloadNotFoundError(error) && failureCount < 2
}
