import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Mail } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">

        {/* Shield Icon */}
        <div className="w-24 h-24 mx-auto mb-7 bg-gray-900 border border-red-500/30 rounded-full flex items-center justify-center">
          <ShieldAlert size={40} className="text-red-400" />
        </div>

        {/* 403 Badge */}
        <div className="inline-block bg-red-500/10 border border-red-500/25 rounded-full px-4 py-1 mb-5">
          <span className="text-red-400 text-xs font-semibold tracking-widest">ERROR 403</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
         you don't have permission to access this page. It might be restricted to administrators only.
          <br />
          If you think this is an error, please contact the administrator.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-56 bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Previous Page
          </button>

          <button
            onClick={() => window.location.href = 'mailto:admin@nexus.io'}
            className="flex items-center justify-center gap-2 w-56 bg-transparent border border-gray-700 hover:border-gray-500 hover:text-white text-gray-400 rounded-lg py-3 text-sm transition-colors"
          >
            <Mail size={15} />
            Contct to Admin
          </button>
        </div>

        {/* Current user info */}
        {user && (
          <p className="text-gray-700 text-xs mt-10">
           Login Your Account{' '}
            <span className="text-violet-400">{user.email}</span>{' '}
            · Role:{' '}
            <span className="text-red-400 capitalize">{user.role}</span>
          </p>
        )}
      </div>
    </div>
  )
}