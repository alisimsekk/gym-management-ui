import { request } from '../../../shared/api/httpClient'
import type { TrainerWorkloadSummary } from '../types/workload.types'

export const getTrainerWorkloadSummary = (
  trainerUsername: string,
): Promise<TrainerWorkloadSummary> =>
  request<TrainerWorkloadSummary>(
    `/report/summary/${encodeURIComponent(trainerUsername)}`,
    { method: 'GET', auth: true },
  )
