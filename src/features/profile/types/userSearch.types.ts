import type { UserRole } from '../../auth/types/auth.types'

/** Backend Java UserType ile eslesir; ara isteklerde genelde bos birakilir (servis set eder). */
export interface UserSearchRequest {
  firstName?: string
  lastName?: string
  username?: string
  userType?: UserRole
}
