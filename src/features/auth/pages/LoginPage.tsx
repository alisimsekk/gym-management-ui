import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'
import { useLoginMutation } from '../hooks/useLoginMutation'
import type { LoginRequest } from '../types/auth.types'
import { ApiError } from '../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { getRouteByRole } from '../utils/authRedirect'
import { buildSessionFromLogin } from '../utils/authSession'
import { saveSession } from '../utils/authStorage'

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const loginMutation = useLoginMutation()

  const handleLogin = (payload: LoginRequest) => {
    setError(null)
    loginMutation.mutate(payload, {
      onSuccess: (response) => {
        const session = buildSessionFromLogin(response)
        saveSession(session)
        navigate(getRouteByRole(), { replace: true })
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          setError(
            resolveUserFacingApiErrorMessage(
              err,
              'Giriş işlemi başarısız oldu.',
            ),
          )
          return
        }
        setError(
          'Sunucuya bağlanılamadı. Lütfen backend servis ve ağ ayarlarını kontrol edin.',
        )
      },
    })
  }

  return (
    <AuthLayout
      title="Giriş Yap"
      subtitle="Hesabına giriş yaparak antrenman ve profil işlemlerine devam et."
    >
      <LoginForm
        loading={loginMutation.isPending}
        error={error}
        onSubmit={handleLogin}
      />
    </AuthLayout>
  )
}
