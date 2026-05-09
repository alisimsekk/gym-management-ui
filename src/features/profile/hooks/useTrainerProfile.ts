import { useQuery } from '@tanstack/react-query'
import { getTrainerProfile } from '../services/profileService'

export const trainerProfileKey = (username: string) =>
  ['profile', 'trainer', username] as const

export const useTrainerProfile = (username: string | null) =>
  useQuery({
    queryKey: trainerProfileKey(username ?? ''),
    queryFn: () => getTrainerProfile(username as string),
    enabled: Boolean(username),
  })
