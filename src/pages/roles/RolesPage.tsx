import { ShieldCheck, Users } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShieldCheck size={28} /> Roles &amp; Access Control
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Role */}
        <div className="bg-gray-900 border border-violet-500/30 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-violet-400">Admin</h2>
              <p className="text-sm text-gray-500">Full system access</p>
            </div>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> Manage users</li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> View analytics &amp; revenue</li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> Full dashboard access</li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> Role management</li>
          </ul>
        </div>

        {/* User Role */}
        <div className="bg-gray-900 border border-emerald-500/30 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Users size={28} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-emerald-400">User</h2>
              <p className="text-sm text-gray-500">Limited access</p>
            </div>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> View own profile</li>
            <li className="flex gap-3"><span className="text-emerald-400">✓</span> Settings &amp; notifications</li>
            <li className="flex gap-3 text-gray-500"><span>✕</span> Cannot manage users</li>
            <li className="flex gap-3 text-gray-500"><span>✕</span> No analytics access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}