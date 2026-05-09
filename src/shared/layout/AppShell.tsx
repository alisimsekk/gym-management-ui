import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />
      <Outlet />
    </div>
  )
}
