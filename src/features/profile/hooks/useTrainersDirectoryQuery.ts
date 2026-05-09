import { useQuery } from '@tanstack/react-query'
import { searchTrainersDirectory } from '../services/userDirectoryService'
import type { UserSearchRequest } from '../types/userSearch.types'

export const trainersDirectoryKey = (filter: UserSearchRequest) =>
  ['trainers-directory', filter] as const

export const useTrainersDirectoryQuery = (
  filter: UserSearchRequest,
  opts?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: trainersDirectoryKey(filter),
    queryFn: () => searchTrainersDirectory(filter),
    enabled: opts?.enabled ?? true,
  })
