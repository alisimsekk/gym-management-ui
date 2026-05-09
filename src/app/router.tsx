import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './routeGuards'
import { AppShell } from '../shared/layout/AppShell'
import { ChangePasswordPage } from '../features/auth/pages/ChangePasswordPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage'
import { ProfileLayout } from '../features/profile/pages/ProfileLayout'
import { ProfileOverviewPage } from '../features/profile/pages/ProfileOverviewPage'
import { MyWorkoutsPage } from '../features/workouts/pages/MyWorkoutsPage'
import { TrainerWorkloadPage } from '../features/profile/pages/TrainerWorkloadPage'
import { TraineeTrainersManagePage } from '../features/profile/pages/TraineeTrainersManagePage'
import { TrainerAssignedTraineesPage } from '../features/profile/pages/TrainerAssignedTraineesPage'
import { CreateTrainingPage } from '../features/workouts/pages/CreateTrainingPage'
import App from '../App'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/auth/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/register',
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/auth/change-password',
            element: <ChangePasswordPage />,
          },
          {
            path: '/antrenman/yeni',
            element: <CreateTrainingPage />,
          },
          {
            path: '/profil',
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <ProfileOverviewPage />,
              },
              {
                path: 'antrenorler',
                element: <TraineeTrainersManagePage />,
              },
              {
                path: 'antrenmanlar',
                element: <MyWorkoutsPage />,
              },
              {
                path: 'ogrencilerim',
                element: <TrainerAssignedTraineesPage />,
              },
              {
                path: 'is-yuku',
                element: <TrainerWorkloadPage />,
              },
            ],
          },
          {
            path: '/admin',
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
])
