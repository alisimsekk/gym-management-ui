import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation'
import { ApiError } from '../../../shared/api/apiError'
import { resolveUserFacingApiErrorMessage } from '../../../shared/utils/resolveUserFacingApiError'
import { clearSession, getSession } from '../utils/authStorage'

export function ChangePasswordPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const changePasswordMutation = useChangePasswordMutation()

  const session = getSession()
  const defaultUsername = session?.username ?? ''

  return (
    <AuthLayout
      title="Şifre Değiştir"
      subtitle="Güvenlik nedeniyle şifrenizi değiştirdikten sonra tekrar giriş yapmanız gerekir."
    >
      <ChangePasswordForm
        lockedUsername={defaultUsername}
        loading={changePasswordMutation.isPending}
        error={error}
        onSubmit={(payload) => {
          setError(null)
          setSuccessMessage(null)
          changePasswordMutation.mutate(payload, {
            onSuccess: () => {
              clearSession()
              setSuccessMessage(
                'Şifreniz değiştirildi. Lütfen tekrar giriş yapın.',
              )
              setTimeout(() => navigate('/auth/login'), 700)
            },
            onError: (err) => {
              if (err instanceof ApiError) {
                setError(
                  resolveUserFacingApiErrorMessage(
                    err,
                    'Şifre değiştirme işlemi başarısız oldu.',
                  ),
                )
                return
              }
              setError('Şifre değiştirme işlemi başarısız oldu.')
            },
          })
        }}
      />
      {successMessage && (
        <p className="mt-4 rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {successMessage}
        </p>
      )}
    </AuthLayout>
  )
}
