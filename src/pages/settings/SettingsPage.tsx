// src/pages/settings/SettingsPage.tsx
import { useState } from 'react'
import { User, Lock, Bell, Shield, Save, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors'

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-800">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Icon size={14} className="text-violet-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        {desc && <p className="text-xs text-gray-600 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-gray-700'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [name,  setName]  = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [notifs, setNotifs] = useState({ email: true, push: false, updates: true, security: true })

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))   // replace with real API
    updateUser({ name, email })
    toast.success('Settings saved!')
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Profile */}
      <Section icon={User} title="Profile Settings">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role} · {user?.status}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
            <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </Section>

      {/* Password */}
      <Section icon={Lock} title="Change Password">
        <div className="space-y-4">
          {[
            { label: 'Current Password', name: 'current' },
            { label: 'New Password',     name: 'new' },
            { label: 'Confirm New Password', name: 'confirm' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
              <input type="password" className={inputCls} placeholder="••••••••" />
            </div>
          ))}
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Lock size={13} />
            Update Password
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notification Preferences">
        <Toggle label="Email Notifications"  desc="Receive updates via email"        checked={notifs.email}    onChange={(v) => setNotifs(p => ({ ...p, email: v }))} />
        <Toggle label="Push Notifications"   desc="Browser push notifications"       checked={notifs.push}     onChange={(v) => setNotifs(p => ({ ...p, push: v }))} />
        <Toggle label="Product Updates"      desc="New features and announcements"   checked={notifs.updates}  onChange={(v) => setNotifs(p => ({ ...p, updates: v }))} />
        <Toggle label="Security Alerts"      desc="Login attempts and account alerts" checked={notifs.security} onChange={(v) => setNotifs(p => ({ ...p, security: v }))} />
      </Section>

      {/* Danger Zone */}
      <Section icon={Shield} title="Danger Zone">
        <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <div>
            <p className="text-sm text-gray-300">Delete Account</p>
            <p className="text-xs text-gray-600 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </Section>
    </div>
  )
}