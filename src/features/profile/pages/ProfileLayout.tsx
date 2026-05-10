import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { APP_BRAND_NAME } from '../../../shared/constants/brand'
import { ProfileSubNav } from '../components/ProfileSubNav'

const Container = ({ children }: { children: ReactNode }) => (
  <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
    <div className="mb-6">
      <p className="text-xs uppercase tracking-widest text-cyan-300">
        {APP_BRAND_NAME}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-white">Profil</h1>
      <p className="mt-2 text-sm text-slate-400">
        Hesap ve antrenmanlarını buradan yönet.
      </p>
    </div>
    {children}
  </main>
)

export function ProfileLayout() {
  const { role, username, isAuthenticated } = useAuth()

  if (!isAuthenticated || !username || !role) {
    return <Navigate to="/auth/login" replace />
  }

  if (role === 'ADMIN') {
    return (
      <Container>
        <ProfileSubNav variant="admin" />
        <Outlet />
      </Container>
    )
  }

  return (
    <Container>
      <ProfileSubNav
        variant="default"
        showWorkload={role === 'TRAINER'}
        showTraineeTrainers={role === 'TRAINEE'}
        showTrainerAssignedStudents={role === 'TRAINER'}
      />
      <Outlet />
    </Container>
  )
}
