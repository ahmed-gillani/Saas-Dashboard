import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" />

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}
