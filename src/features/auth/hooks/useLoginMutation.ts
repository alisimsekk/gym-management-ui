import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'

export const useLoginMutation = () => useMutation({ mutationFn: login })
