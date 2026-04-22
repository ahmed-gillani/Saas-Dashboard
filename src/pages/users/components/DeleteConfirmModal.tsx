import { useRef } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { User } from '../../../types/auth.types'
import { useDeleteUser } from '../../../hooks/useUsers'

interface Props {
  user: User
  onClose: () => void
}

export default function DeleteConfirmModal({ user, onClose }: Props) {
  const deleteUser = useDeleteUser()
  const overlayRef = useRef<HTMLDivElement>(null)

  async function handleDelete() {
    await deleteUser.mutateAsync(user.id)
    onClose()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150 p-6">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-center text-sm font-semibold text-white mb-1">Delete User?</h2>
        <p className="text-center text-xs text-gray-400 mb-6">
          <span className="text-gray-200 font-medium">{user.name}</span> ka account permanently delete ho jaye ga. Yeh action undo nahi ho sakta.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleteUser.isPending}
            className="flex-1 py-2 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleteUser.isPending
              ? <><Loader2 size={14} className="animate-spin" /> Deleting…</>
              : 'Yes, Delete'
            }
          </button>
        </div>
      </div>
    </div>
  )
}