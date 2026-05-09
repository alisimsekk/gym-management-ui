import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../services/authService'

export const useChangePasswordMutation = () =>
  useMutation({ mutationFn: changePassword })
