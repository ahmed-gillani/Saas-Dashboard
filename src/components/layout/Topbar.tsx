import { Bell, Sun, Moon, Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useNotifications } from '../../hooks/useNotifications'
import { format } from 'date-fns'

// Mock searchable data — routes pe redirect karta hai
const SEARCH_ITEMS = [
  { label: 'Dashboard',  desc: 'Overview & stats',        path: '/dashboard', icon: '◈' },
  { label: 'Users',      desc: 'Manage all users',        path: '/users',     icon: '◉' },
  { label: 'Analytics',  desc: 'Traffic & conversions',   path: '/analytics', icon: '▦' },
  { label: 'Settings',   desc: 'Profile & preferences',   path: '/settings',  icon: '⊙' },
  { label: 'Roles',      desc: 'Role-based access',       path: '/roles',     icon: '◫' },
  { label: 'Home',       desc: 'User home page',          path: '/home',      icon: '⌂' },
]

export default function Topbar({ title }: { title: string }) {
  const { isDark, toggleTheme }        = useThemeStore()
  const { notifications, unreadCount } = useNotificationStore()
  const { markAsRead, markAllAsRead }  = useNotifications()
  const navigate  = useNavigate()

  const [notifOpen,   setNotifOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen,  setSearchOpen]  = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      searchQuery.length > 0 &&
      (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  function handleSelect(path: string) {
    navigate(path)
    setSearchQuery('')
    setSearchOpen(false)
  }

  return (
    // <header className="bg-gray-900 border-b border-gray-800 px-5 py-3 flex items-center gap-3 relative z-10">
    <header className="bg-gray-900 border-b border-gray-800 px-5 md:px-5 pl-20 md:pl-5 py-3 flex items-center gap-3 relative z-20">
      <h1 className="text-sm font-semibold text-white flex-1">{title}</h1>

      {/* ── Search ── */}
      <div className="relative hidden sm:block" ref={searchRef}>
        <Search size={13} className="absolute left-3 top-2.5 text-gray-500 pointer-events-none" />
        <input
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search pages, users..."
          className="bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-8 py-2 text-xs text-white placeholder-gray-500 outline-none w-48 focus:border-violet-500 focus:w-56 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSearchOpen(false) }}
            className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-300"
          >
            <X size={12} />
          </button>
        )}

        {/* Dropdown results */}
        {searchOpen && searchQuery.length > 0 && (
          <div className="absolute top-10 left-0 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-4">No results found</p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors text-left"
                >
                  <span className="text-violet-400 text-sm w-4 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-200 font-medium">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen((p) => !p); setSearchOpen(false) }}
          className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-xs font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[10px] text-violet-400 hover:text-violet-300">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 text-xs py-6">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${!n.isRead ? 'bg-violet-500/5' : ''}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      n.type === 'success' ? 'bg-emerald-400'
                      : n.type === 'error' ? 'bg-red-400'
                      : n.type === 'warning' ? 'bg-amber-400'
                      : 'bg-violet-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-200 leading-snug">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {format(new Date(n.createdAt), 'dd MMM · HH:mm')}
                      </p>
                    </div>
                    {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}