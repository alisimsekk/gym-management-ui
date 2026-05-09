import { useMutation } from '@tanstack/react-query'
import { registerTrainee } from '../services/authService'

export const useRegisterMutation = () =>
  useMutation({ mutationFn: registerTrainee })
