import { request } from '../../../shared/api/httpClient'
import type {
  TraineeProfileResponse,
  TrainerProfileResponse,
} from '../types/profile.types'
import type { UserSearchRequest } from '../types/userSearch.types'

export const searchTrainersDirectory = (
  body: UserSearchRequest,
): Promise<TrainerProfileResponse[]> =>
  request<TrainerProfileResponse[], UserSearchRequest>('/trainers/search', {
    method: 'POST',
    body,
    auth: true,
  })

export const searchTraineesDirectory = (
  body: UserSearchRequest,
): Promise<TraineeProfileResponse[]> =>
  request<TraineeProfileResponse[], UserSearchRequest>('/trainees/search', {
    method: 'POST',
    body,
    auth: true,
  })
