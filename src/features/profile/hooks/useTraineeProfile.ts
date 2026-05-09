import { useQuery } from '@tanstack/react-query'
import { getTraineeProfile } from '../services/profileService'

export const traineeProfileKey = (username: string) =>
  ['profile', 'trainee', username] as const

export const useTraineeProfile = (username: string | null) =>
  useQuery({
    queryKey: traineeProfileKey(username ?? ''),
    queryFn: () => getTraineeProfile(username as string),
    enabled: Boolean(username),
  })
