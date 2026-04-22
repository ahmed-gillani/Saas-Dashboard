import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { TopUser } from '../../../api/dashboardApi.types'
import { formatDistanceToNow } from 'date-fns'

// Mock data
const MOCK_USERS: TopUser[] = [
  { id: '1', name: 'Sara Ahmed', email: 'sara@co.com', role: 'admin', status: 'active', lastActive: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', name: 'Mohsin Khan', email: 'mohsin@co.com', role: 'user', status: 'active', lastActive: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: '3', name: 'Fatima Raza', email: 'fatima@co.com', role: 'user', status: 'inactive', lastActive: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '4', name: 'Asad Qureshi', email: 'asad@co.com', role: 'admin', status: 'active', lastActive: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: '5', name: 'Zara Baig', email: 'zara@co.com', role: 'user', status: 'active', lastActive: new Date(Date.now() - 10 * 60000).toISOString() },
]

const COLORS = ['bg-violet-600', 'bg-emerald-600', 'bg-amber-600', 'bg-red-600', 'bg-blue-600']

export default function RecentUsersTable() {
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')

  const { data: users = MOCK_USERS, isLoading } = useQuery({
    queryKey: ['top-users'],
    queryFn: () => MOCK_USERS,  // dashboardApi.getTopUsers()
  })

  const filtered = roleFilter === 'all' ? users : users.filter((u: TopUser) => u.role === roleFilter)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Recent Users</h2>
        <div className="flex gap-2">
          {(['all', 'admin', 'user'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors ${roleFilter === r
                ? 'bg-violet-600 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-600 uppercase tracking-wide text-[10px]">
              <th className="text-left pb-3 font-medium">User</th>
              <th className="text-left pb-3 font-medium">Role</th>
              <th className="text-left pb-3 font-medium">Status</th>
              <th className="text-left pb-3 font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((user: TopUser, i: number) => (
              <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${COLORS[i % COLORS.length]}`}>
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{user.name}</p>
                      <p className="text-gray-500 text-[10px]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.role === 'admin'
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'
                      }`} />
                    <span className={user.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-gray-500">
                  {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}