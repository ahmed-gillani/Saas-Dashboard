import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

// Route ke hisaab se title deta hai
const pageTitles: Record<string, string> = {
  '/home': 'Home',
  '/dashboard': 'Dashboard',
  '/users': 'User Management',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/roles': 'Roles & Access',
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}