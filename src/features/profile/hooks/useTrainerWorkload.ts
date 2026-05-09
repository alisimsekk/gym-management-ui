import { useQuery } from '@tanstack/react-query'
import { getTrainerWorkloadSummary } from '../services/workloadService'

export const trainerWorkloadKey = (username: string) =>
  ['trainer-workload', username] as const

export const useTrainerWorkload = (username: string | null) =>
  useQuery({
    queryKey: trainerWorkloadKey(username ?? ''),
    queryFn: () => getTrainerWorkloadSummary(username as string),
    enabled: Boolean(username),
  })
