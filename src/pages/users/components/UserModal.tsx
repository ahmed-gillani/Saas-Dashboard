import { useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { User } from '../../../types/auth.types'
import type { CreateUserInput, UpdateUserInput } from '../../../api/usersApi.types'
import { useCreateUser, useUpdateUser } from '../../../hooks/useUsers'

interface Props {
  user: User | null   // null → create mode
  onClose: () => void
}

const AVATAR_COLORS = [
  'bg-violet-600', 'bg-emerald-600', 'bg-amber-600',
  'bg-red-600', 'bg-blue-600', 'bg-pink-600',
]

function getColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

// ── Small field wrapper ───────────────────────────────────────────────────────
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 ' +
  'placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 ' +
  'focus:ring-violet-500/30 transition-colors'

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function UserModal({ user, onClose }: Props) {
  const isEdit = !!user
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isPending = createUser.isPending || updateUser.isPending

  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => (fd.get(k) as string).trim()

    if (isEdit) {
      const data: UpdateUserInput = {
        name: get('name') || undefined,
        email: get('email') || undefined,
        role: get('role') as UpdateUserInput['role'],
        status: get('status') as UpdateUserInput['status'],
      }
      await updateUser.mutateAsync({ id: user.id, data })
    } else {
      const data: CreateUserInput = {
        name: get('name'),
        email: get('email'),
        password: get('password'),
        role: get('role') as CreateUserInput['role'],
      }
      await createUser.mutateAsync(data)
    }
    onClose()
  }

  const initials = (user?.name ?? '').slice(0, 2).toUpperCase()

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Panel */}
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {isEdit ? (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getColor(user.name)}`}>
                {initials}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <span className="text-violet-400 text-lg font-light">+</span>
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-white">
                {isEdit ? 'Edit User' : 'Add New User'}
              </h2>
              {isEdit && (
                <p className="text-[11px] text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Name */}
          <Field label="Full Name" required>
            <input
              name="name"
              defaultValue={user?.name}
              required
              placeholder="e.g. Sara Ahmed"
              className={inputCls}
              autoFocus
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" required>
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              required
              placeholder="sara@example.com"
              className={inputCls}
            />
          </Field>

          {/* Password — only on create */}
          {!isEdit && (
            <Field label="Password" required>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="min. 6 characters"
                className={inputCls}
              />
            </Field>
          )}

          {/* Role + Status in a row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role" required>
              <select
                name="role"
                defaultValue={user?.role ?? 'user'}
                required
                className={inputCls + ' cursor-pointer'}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>

            {isEdit && (
              <Field label="Status">
                <select
                  name="status"
                  defaultValue={user?.status ?? 'active'}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : (
                isEdit ? 'Save Changes' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}