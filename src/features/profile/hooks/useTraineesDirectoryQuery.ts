import { useQuery } from '@tanstack/react-query'
import { searchTraineesDirectory } from '../services/userDirectoryService'
import type { UserSearchRequest } from '../types/userSearch.types'

export const traineesDirectoryKey = (filter: UserSearchRequest) =>
  ['trainees-directory', filter] as const

export const useTraineesDirectoryQuery = (
  filter: UserSearchRequest,
  opts?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: traineesDirectoryKey(filter),
    queryFn: () => searchTraineesDirectory(filter),
    enabled: opts?.enabled ?? true,
  })
