import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'
import { useLoginMutation } from '../hooks/useLoginMutation'
import { useRegisterMutation } from '../hooks/useRegisterMutation'
import type { RegisterRequest } from '../types/auth.types'
import { getRouteByRole } from '../utils/authRedirect'
import { buildSessionFromLogin } from '../utils/authSession'
import { saveSession } from '../utils/authStorage'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'

export function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const loginMutation = useLoginMutation()
  const [error, setError] = useState<string | null>(null)

  const handleRegister = (payload: RegisterRequest) => {
    setError(null)
    registerMutation.mutate(payload, {
      onSuccess: (registerResponse) => {
        // Backend register response provides generated credentials.
        loginMutation.mutate(
          {
            username: registerResponse.username,
            password: registerResponse.password,
          },
          {
            onSuccess: (loginResponse) => {
              const session = buildSessionFromLogin(loginResponse)
              saveSession(session)
              const plainPassword = registerResponse.password
              navigate(getRouteByRole(session.role), {
                state: {
                  registerWelcome: {
                    username: registerResponse.username,
                    plainPassword,
                  },
                },
              })
            },
            onError: () => {
              setError(
                'Kayıt oluşturuldu ancak otomatik giriş başarısız. Lütfen giriş yapın.',
              )
              navigate('/auth/login')
            },
          },
        )
      },
      onError: (err) => {
        setError(
          resolveUserFacingApiErrorMessage(
            err,
            'Kayıt işlemi sırasında bir hata oluştu.',
          ),
        )
      },
    })
  }

  return (
    <AuthLayout
      title="Kayıt Ol"
      subtitle="dateOfBirth ve address alanları opsiyoneldir; profil sayfasından sonra güncellenebilir."
    >
      <RegisterForm
        loading={registerMutation.isPending || loginMutation.isPending}
        error={error}
        onSubmit={handleRegister}
      />
    </AuthLayout>
  )
}
