import { createBrowserRouter } from 'react-router-dom'
import { AdminRoute, ProtectedRoute } from './routeGuards'
import { AppShell } from '../shared/layout/AppShell'
import { AdminLayout } from '../features/admin/layout/AdminLayout'
import { ChangePasswordPage } from '../features/auth/pages/ChangePasswordPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage'
import { AdminCreateTraineePage } from '../features/admin/pages/users/AdminCreateTraineePage'
import { AdminCreateTrainerPage } from '../features/admin/pages/users/AdminCreateTrainerPage'
import { AdminCreateAdminPage } from '../features/admin/pages/users/AdminCreateAdminPage'
import { AdminTrainersListPage } from '../features/admin/pages/trainers/AdminTrainersListPage'
import { AdminTrainerDetailPage } from '../features/admin/pages/trainers/AdminTrainerDetailPage'
import { AdminTraineesListPage } from '../features/admin/pages/trainees/AdminTraineesListPage'
import { AdminTraineeDetailPage } from '../features/admin/pages/trainees/AdminTraineeDetailPage'
import { AdminTrainingTypesPage } from '../features/admin/pages/AdminTrainingTypesPage'
import { AdminTrainingsListPage } from '../features/admin/pages/AdminTrainingsListPage'
import { AdminTrainerWorkloadPage } from '../features/admin/pages/reports/AdminTrainerWorkloadPage'
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
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <AdminDashboardPage />,
                  },
                  {
                    path: 'kullanicilar/yeni-ogrenci',
                    element: <AdminCreateTraineePage />,
                  },
                  {
                    path: 'kullanicilar/yeni-antrenor',
                    element: <AdminCreateTrainerPage />,
                  },
                  {
                    path: 'kullanicilar/yeni-admin',
                    element: <AdminCreateAdminPage />,
                  },
                  {
                    path: 'antrenorler',
                    element: <AdminTrainersListPage />,
                  },
                  {
                    path: 'antrenorler/:username',
                    element: <AdminTrainerDetailPage />,
                  },
                  {
                    path: 'ogrenciler',
                    element: <AdminTraineesListPage />,
                  },
                  {
                    path: 'ogrenciler/:username',
                    element: <AdminTraineeDetailPage />,
                  },
                  {
                    path: 'antrenman-turleri',
                    element: <AdminTrainingTypesPage />,
                  },
                  {
                    path: 'antrenmanlar',
                    element: <AdminTrainingsListPage />,
                  },
                  {
                    path: 'antrenmanlar/yeni',
                    element: <CreateTrainingPage />,
                  },
                  {
                    path: 'raporlar/antrenor/:username',
                    element: <AdminTrainerWorkloadPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
