// import { useState, useCallback } from 'react'
// import {
//   Search, Plus, Pencil, Trash2, ChevronLeft,
//   ChevronRight, UserX, RefreshCw,
// } from 'lucide-react'
// import { useUserFilters, useUsers } from '../../hooks/useUsers'
// import type { User } from '../../types/auth.types'
// import UserModal from './components/UserModal'
// import DeleteConfirmModal from './components/DeleteConfirmModal'

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const COLORS = [
//   'bg-violet-600', 'bg-emerald-600', 'bg-amber-600',
//   'bg-red-600', 'bg-blue-600', 'bg-pink-600',
// ]

// function getColor(name: string) {
//   let h = 0
//   for (let i = 0; i < name.length; i++) {
//     h = name.charCodeAt(i) + ((h << 5) - h)
//   }
//   return COLORS[Math.abs(h) % COLORS.length]
// }

// const LIMIT = 6

// function timeAgo(iso: string) {
//   const s = (Date.now() - new Date(iso).getTime()) / 1000
//   if (s < 60) return 'Just now'
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`
//   return `${Math.floor(s / 86400)}d ago`
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function UsersPage() {
//   const filters = useUserFilters()
//   const { page, setPage, search, setSearch, role, setRole, status, setStatus, reset } = filters

//   // Real API call with filters (when backend is ready)
//   const { data: apiResponse = { users: [], total: 0, totalPages: 1 } } = useUsers({
//     page,
//     limit: LIMIT,
//     search: search || undefined,
//     role: role === 'all' ? undefined : role,
//     status: status === 'all' ? undefined : status,
//   })

//   // Fallback to mock data if API returns empty (for development)
//   const MOCK_USERS: User[] = [
//     { id: '1', name: 'Sara Ahmed', email: 'sara@nexus.io', role: 'admin', status: 'active', createdAt: '2024-01-10T00:00:00Z', lastLogin: new Date(Date.now() - 5 * 60000).toISOString() },
//     { id: '2', name: 'Mohsin Khan', email: 'mohsin@nexus.io', role: 'user', status: 'active', createdAt: '2024-02-15T00:00:00Z', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString() },
//     { id: '3', name: 'Fatima Raza', email: 'fatima@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-03-01T00:00:00Z', lastLogin: new Date(Date.now() - 7 * 86400000).toISOString() },
//     { id: '4', name: 'Asad Qureshi', email: 'asad@nexus.io', role: 'admin', status: 'active', createdAt: '2024-03-20T00:00:00Z', lastLogin: new Date(Date.now() - 1 * 3600000).toISOString() },
//     { id: '5', name: 'Zara Baig', email: 'zara@nexus.io', role: 'user', status: 'active', createdAt: '2024-04-05T00:00:00Z', lastLogin: new Date(Date.now() - 30 * 60000).toISOString() },
//     { id: '6', name: 'Hamza Ali', email: 'hamza@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-04-18T00:00:00Z', lastLogin: new Date(Date.now() - 14 * 86400000).toISOString() },
//     { id: '7', name: 'Nida Farooq', email: 'nida@nexus.io', role: 'admin', status: 'active', createdAt: '2024-05-02T00:00:00Z', lastLogin: new Date(Date.now() - 20 * 60000).toISOString() },
//     { id: '8', name: 'Bilal Siddiqui', email: 'bilal@nexus.io', role: 'user', status: 'active', createdAt: '2024-05-14T00:00:00Z', lastLogin: new Date(Date.now() - 4 * 3600000).toISOString() },
//   ]

//   const allUsers = apiResponse.users.length > 0 ? apiResponse.users : MOCK_USERS

//   const filtered = allUsers.filter((u) => {
//     const matchSearch = !search || 
//       u.name.toLowerCase().includes(search.toLowerCase()) || 
//       u.email.toLowerCase().includes(search.toLowerCase())
//     const matchRole = role === 'all' || u.role === role
//     const matchStatus = status === 'all' || u.status === status
//     return matchSearch && matchRole && matchStatus
//   })

//   const totalPages = apiResponse.totalPages || Math.max(1, Math.ceil(filtered.length / LIMIT))
//   const paged = filtered.slice((page - 1) * LIMIT, page * LIMIT)

//   const [addOpen, setAddOpen] = useState(false)
//   const [editUser, setEditUser] = useState<User | null>(null)
//   const [deleteUser, setDeleteUser] = useState<User | null>(null)

//   const openEdit = useCallback((u: User) => setEditUser(u), [])
//   const openDelete = useCallback((u: User) => setDeleteUser(u), [])

//   const handleSearch = (v: string) => { setSearch(v); setPage(1) }
//   const handleRole = (v: typeof role) => { setRole(v); setPage(1) }
//   const handleStatus = (v: typeof status) => { setStatus(v); setPage(1) }

//   // Summary counts (based on current filtered list)
//   const activeCount = allUsers.filter(u => u.status === 'active').length
//   const inactiveCount = allUsers.filter(u => u.status === 'inactive').length
//   const adminCount = allUsers.filter(u => u.role === 'admin').length

//   return (
//     <div className="space-y-4">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {[
//           { label: 'Total Users', value: allUsers.length, color: 'text-violet-400', bg: 'bg-violet-500/10' },
//           { label: 'Active', value: activeCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
//           { label: 'Inactive', value: inactiveCount, color: 'text-gray-400', bg: 'bg-gray-700/30' },
//           { label: 'Admins', value: adminCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
//         ].map(({ label, value, color, bg }) => (
//           <div key={label} className={`${bg} border border-gray-800 rounded-xl px-4 py-3`}>
//             <p className="text-xs text-gray-500 mb-1">{label}</p>
//             <p className={`text-2xl font-bold ${color}`}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Table Card */}
//       <div className="bg-gray-900 border border-gray-800 rounded-xl">

//         {/* Toolbar */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-800">

//           {/* Search */}
//           <div className="relative flex-1 max-w-xs">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Search name or email…"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
//             />
//           </div>

//           {/* Role filter */}
//           <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
//             {(['all', 'admin', 'user'] as const).map((r) => (
//               <button
//                 key={r}
//                 onClick={() => handleRole(r)}
//                 className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${role === r ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
//               >
//                 {r}
//               </button>
//             ))}
//           </div>

//           {/* Status filter */}
//           <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
//             {(['all', 'active', 'inactive'] as const).map((s) => (
//               <button
//                 key={s}
//                 onClick={() => handleStatus(s)}
//                 className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${status === s ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>

//           {/* Reset */}
//           {(search || role !== 'all' || status !== 'all') && (
//             <button
//               onClick={reset}
//               className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
//             >
//               <RefreshCw size={12} />
//               Reset
//             </button>
//           )}

//           <div className="sm:ml-auto">
//             <button
//               onClick={() => setAddOpen(true)}
//               className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
//             >
//               <Plus size={14} />
//               Add User
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs">
//             <thead>
//               <tr className="text-gray-600 uppercase tracking-wide text-[10px] border-b border-gray-800">
//                 <th className="text-left px-5 py-3 font-medium">User</th>
//                 <th className="text-left px-4 py-3 font-medium">Role</th>
//                 <th className="text-left px-4 py-3 font-medium">Status</th>
//                 <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
//                 <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Last Login</th>
//                 <th className="text-right px-5 py-3 font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800/60">
//               {paged.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-3 text-gray-600">
//                       <UserX size={28} />
//                       <p className="text-sm">No users found</p>
//                       {(search || role !== 'all' || status !== 'all') && (
//                         <button
//                           onClick={reset}
//                           className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
//                         >
//                           Clear filters
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 paged.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-800/40 transition-colors group">
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getColor(user.name)}`}>
//                           {user.name.slice(0, 2).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="text-gray-200 font-medium">{user.name}</p>
//                           <p className="text-gray-500 text-[11px]">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.role === 'admin'
//                         ? 'bg-violet-500/20 text-violet-400'
//                         : 'bg-emerald-500/20 text-emerald-400'
//                         }`}>
//                         {user.role}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1.5">
//                         <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
//                         <span className={user.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}>
//                           {user.status}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
//                       {new Date(user.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
//                     </td>

//                     <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
//                       {user.lastLogin ? timeAgo(user.lastLogin) : '—'}
//                     </td>

//                     <td className="px-5 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => openEdit(user)}
//                           className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil size={13} />
//                         </button>
//                         <button
//                           onClick={() => openDelete(user)}
//                           className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
//             <p className="text-xs text-gray-500">
//               Showing <span className="text-gray-300">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)}</span> of <span className="text-gray-300">{filtered.length}</span> users
//             </p>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft size={14} />
//               </button>
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setPage(i + 1)}
//                   className={`w-7 h-7 rounded-lg text-xs transition-colors ${page === i + 1
//                     ? 'bg-violet-600 text-white'
//                     : 'text-gray-500 hover:text-white hover:bg-gray-800'
//                     }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {addOpen && <UserModal user={null} onClose={() => setAddOpen(false)} />}
//       {editUser && <UserModal user={editUser} onClose={() => setEditUser(null)} />}
//       {deleteUser && <DeleteConfirmModal user={deleteUser} onClose={() => setDeleteUser(null)} />}
//     </div>
//   )
// }

import { useState, useCallback } from 'react'
import {
  Search, Plus, Pencil, Trash2, ChevronLeft,
  ChevronRight, UserX, RefreshCw,
} from 'lucide-react'
import { useUserFilters, useUsers } from '../../hooks/useUsers'
import type { User } from '../../types/auth.types'
import UserModal from './components/UserModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'

// ── Helpers ───────────────────────────────────────────────────────────────────
const COLORS = [
  'bg-violet-600', 'bg-emerald-600', 'bg-amber-600',
  'bg-red-600', 'bg-blue-600', 'bg-pink-600',
]

function getColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h)
  }
  return COLORS[Math.abs(h) % COLORS.length]
}

const LIMIT = 6

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'Just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const filters = useUserFilters()
  const { page, setPage, search, setSearch, role, setRole, status, setStatus, reset } = filters

  // Real API call with filters (when backend is ready)
  const { data: apiResponse = { users: [], total: 0, totalPages: 1 } } = useUsers({
    page,
    limit: LIMIT,
    search: search || undefined,
    role: role === 'all' ? undefined : role,
    status: status === 'all' ? undefined : status,
  })

  // Fallback to mock data if API returns empty (for development)
  const MOCK_USERS: User[] = [
  //   { id: '1', name: 'Sara Ahmed', email: 'sara@nexus.io', role: 'admin', status: 'active', createdAt: '2024-01-10T00:00:00Z', lastLogin: new Date(Date.now() - 5 * 60000).toISOString() },
  //   { id: '2', name: 'Mohsin Khan', email: 'mohsin@nexus.io', role: 'user', status: 'active', createdAt: '2024-02-15T00:00:00Z', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString() },
  //   { id: '3', name: 'Fatima Raza', email: 'fatima@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-03-01T00:00:00Z', lastLogin: new Date(Date.now() - 7 * 86400000).toISOString() },
  //   { id: '4', name: 'Asad Qureshi', email: 'asad@nexus.io', role: 'admin', status: 'active', createdAt: '2024-03-20T00:00:00Z', lastLogin: new Date(Date.now() - 1 * 3600000).toISOString() },
  //   { id: '5', name: 'Zara Baig', email: 'zara@nexus.io', role: 'user', status: 'active', createdAt: '2024-04-05T00:00:00Z', lastLogin: new Date(Date.now() - 30 * 60000).toISOString() },
  //   { id: '6', name: 'Hamza Ali', email: 'hamza@nexus.io', role: 'user', status: 'inactive', createdAt: '2024-04-18T00:00:00Z', lastLogin: new Date(Date.now() - 14 * 86400000).toISOString() },
  //   { id: '7', name: 'Nida Farooq', email: 'nida@nexus.io', role: 'admin', status: 'active', createdAt: '2024-05-02T00:00:00Z', lastLogin: new Date(Date.now() - 20 * 60000).toISOString() },
  //   { id: '8', name: 'Bilal Siddiqui', email: 'bilal@nexus.io', role: 'user', status: 'active', createdAt: '2024-05-14T00:00:00Z', lastLogin: new Date(Date.now() - 4 * 3600000).toISOString() },
  ]

  const allUsers = apiResponse.users.length > 0 ? apiResponse.users : MOCK_USERS

  const filtered = allUsers.filter((u) => {
    const matchSearch = !search || 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = role === 'all' || u.role === role
    const matchStatus = status === 'all' || u.status === status
    return matchSearch && matchRole && matchStatus
  })

  const totalPages = apiResponse.totalPages || Math.max(1, Math.ceil(filtered.length / LIMIT))
  const paged = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const [addOpen, setAddOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const openEdit = useCallback((u: User) => setEditUser(u), [])
  const openDelete = useCallback((u: User) => setDeleteUser(u), [])

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleRole = (v: typeof role) => { setRole(v); setPage(1) }
  const handleStatus = (v: typeof status) => { setStatus(v); setPage(1) }

  // Summary counts (based on current filtered list)
  const activeCount = allUsers.filter(u => u.status === 'active').length
  const inactiveCount = allUsers.filter(u => u.status === 'inactive').length
  const adminCount = allUsers.filter(u => u.role === 'admin').length

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: allUsers.length, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Active', value: activeCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Inactive', value: inactiveCount, color: 'text-gray-400', bg: 'bg-gray-700/30' },
          { label: 'Admins', value: adminCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border border-gray-800 rounded-xl px-4 py-3`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-800">

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>

          {/* Role filter */}
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {(['all', 'admin', 'user'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRole(r)}
                className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${role === r ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {(['all', 'active', 'inactive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${status === s ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reset */}
          {(search || role !== 'all' || status !== 'all') && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          )}

          <div className="sm:ml-auto">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 uppercase tracking-wide text-[10px] border-b border-gray-800">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Last Login</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-600">
                      <UserX size={28} />
                      <p className="text-sm">No users found</p>
                      {(search || role !== 'all' || status !== 'all') && (
                        <button
                          onClick={reset}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-800/60 transition-colors group border-b border-gray-800/30 last:border-none"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getColor(user.name)}`}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium">{user.name}</p>
                          <p className="text-gray-500 text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.role === 'admin'
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        <span className={user.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}>
                          {user.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {user.lastLogin ? timeAgo(user.lastLogin) : '—'}
                    </td>

                    {/* ==================== IMPROVED ACTIONS COLUMN ==================== */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-violet-400 
                                     hover:bg-violet-500/10 active:bg-violet-500/20 
                                     transition-all duration-200 hover:scale-105"
                          title="Edit User"
                        >
                          <Pencil size={16} strokeWidth={2.5} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDelete(user)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 
                                     hover:bg-red-500/10 active:bg-red-500/20 
                                     transition-all duration-200 hover:scale-105"
                          title="Delete User"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                    {/* ==================== END IMPROVED ACTIONS ==================== */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Showing <span className="text-gray-300">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)}</span> of <span className="text-gray-300">{filtered.length}</span> users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs transition-colors ${page === i + 1
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <UserModal user={null} onClose={() => setAddOpen(false)} />}
      {editUser && <UserModal user={editUser} onClose={() => setEditUser(null)} />}
      {deleteUser && <DeleteConfirmModal user={deleteUser} onClose={() => setDeleteUser(null)} />}
    </div>
  )
}