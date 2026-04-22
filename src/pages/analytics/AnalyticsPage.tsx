// src/pages/analytics/AnalyticsPage.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Eye, MousePointerClick, Timer, ArrowUpRight } from 'lucide-react'

const weekData = Array.from({ length: 14 }, (_, i) => ({
  day:      `Day ${i + 1}`,
  views:    Math.floor(Math.random() * 5000) + 2000,
  clicks:   Math.floor(Math.random() * 1000) + 300,
  sessions: Math.floor(Math.random() * 800)  + 100,
}))

const pieData = [
  { name: 'Organic', value: 42, color: '#6c63ff' },
  { name: 'Direct',  value: 28, color: '#00d4aa' },
  { name: 'Social',  value: 18, color: '#ffb547' },
  { name: 'Referral',value: 12, color: '#ff5c6c' },
]

function StatCard({ icon: Icon, label, value, change, color }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center gap-1 text-xs text-emerald-400">
        <ArrowUpRight size={12} /> {change}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye}             label="Page Views"   value="142.3k"  change="↑ 18% this week"   color="bg-violet-500/15 text-violet-400" />
        <StatCard icon={MousePointerClick} label="Click Rate"  value="6.2%"   change="↑ 1.1% this month" color="bg-emerald-500/15 text-emerald-400" />
        <StatCard icon={TrendingUp}      label="Conversions"  value="3,841"   change="↑ 9.4% vs last"    color="bg-amber-500/15 text-amber-400" />
        <StatCard icon={Timer}           label="Avg Session"  value="4m 32s"  change="↑ 23s improvement"  color="bg-blue-500/15 text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Traffic Overview</h2>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Clicks</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="views"  name="Views"  stroke="#6c63ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#00d4aa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-gray-400">{name}</span>
                </div>
                <span className="text-gray-300 font-medium">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Top Pages</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-600 uppercase tracking-wide text-[10px] border-b border-gray-800">
              <th className="text-left pb-3 font-medium">Page</th>
              <th className="text-left pb-3 font-medium">Views</th>
              <th className="text-left pb-3 font-medium">Bounce Rate</th>
              <th className="text-left pb-3 font-medium">Avg Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {[
              { page: '/dashboard',  views: '24,321', bounce: '28%', time: '5m 12s' },
              { page: '/users',      views: '18,432', bounce: '34%', time: '3m 44s' },
              { page: '/analytics',  views: '12,100', bounce: '41%', time: '4m 02s' },
              { page: '/login',      views: '9,875',  bounce: '62%', time: '1m 20s' },
              { page: '/settings',   views: '6,543',  bounce: '19%', time: '6m 33s' },
            ].map(({ page, views, bounce, time }) => (
              <tr key={page} className="hover:bg-gray-800/40 transition-colors">
                <td className="py-3 text-violet-400 font-mono">{page}</td>
                <td className="py-3 text-gray-300">{views}</td>
                <td className="py-3 text-gray-400">{bounce}</td>
                <td className="py-3 text-gray-400">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}