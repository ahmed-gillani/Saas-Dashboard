// src/pages/dashboard/DashboardPage.tsx
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Users, DollarSign, Activity, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useDashboardStats, useRevenueData, useActivityData } from '../../hooks/useDashboard'
import RecentUsersTable from './components/RecentUsersTable'

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value > 1000 ? `$${(p.value / 1000).toFixed(1)}k` : p.value}
        </p>
      ))}
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, change, changeLabel, icon: Icon, iconBg }: {
  label: string; value: string; change: number
  changeLabel: string; icon: React.ElementType; iconBg: string
}) {
  const isUp = change >= 0
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className={`flex items-center gap-1 text-xs ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(change)}% {changeLabel}
      </div>
    </div>
  )
}

// ── Loading Skeleton ───────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats,    isLoading: statsLoading }    = useDashboardStats()
  const { data: revenue,  isLoading: revenueLoading }  = useRevenueData()
  const { data: activity, isLoading: activityLoading } = useActivityData()

  return (
    <div className="space-y-5">

      {/* ── Stat Cards ── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users"     value={stats.totalUsers.toLocaleString()}           change={stats.newUsersThisMonth} changeLabel="this month"    icon={Users}        iconBg="bg-violet-500/15 text-violet-400" />
          <StatCard label="Revenue"         value={`$${(stats.revenue / 1000).toFixed(1)}k`}   change={stats.revenueChange}     changeLabel="vs last month" icon={DollarSign}   iconBg="bg-emerald-500/15 text-emerald-400" />
          <StatCard label="Active Sessions" value={stats.activeSessions.toString()}             change={stats.sessionChange}     changeLabel="today"         icon={Activity}     iconBg="bg-amber-500/15 text-amber-400" />
          <StatCard label="Churn Rate"      value={`${stats.churnRate}%`}                       change={stats.churnChange}       changeLabel="improved"      icon={TrendingDown} iconBg="bg-red-500/15 text-red-400" />
        </div>
      )}

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Revenue Bar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Monthly Revenue</h2>
            <span className="text-xs text-gray-500">Last 7 months</span>
          </div>
          {revenueLoading ? (
            <Skeleton className="h-48 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#6c63ff" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="target"  name="Target"  fill="#374151" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity Area Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">User Activity</h2>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          {activityLoading ? (
            <Skeleton className="h-48 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activity}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(8)} interval={6} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="logins"  name="Logins"  stroke="#6c63ff" fill="url(#g1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="signups" name="Signups" stroke="#00d4aa" fill="url(#g2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Sources */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Traffic Sources</h2>
          {[
            { label: 'Organic Search', pct: 42, color: 'bg-violet-500' },
            { label: 'Direct',         pct: 28, color: 'bg-emerald-500' },
            { label: 'Social Media',   pct: 18, color: 'bg-amber-500' },
            { label: 'Referral',       pct: 12, color: 'bg-red-500' },
          ].map(({ label, pct, color }) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-300 font-medium">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-2">
          <RecentUsersTable />
        </div>
      </div>
    </div>
  )
}