// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Users, BarChart2, Settings, 
  ShieldCheck, LogOut, Bot 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-5 py-3.5 text-[15px] font-medium border-l-2 transition-all group relative ${
      isActive
        ? 'text-white bg-violet-500/10 border-violet-500'
        : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/70'
    }`;

  return (
    <aside className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col h-full shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <span className="text-2xl font-bold tracking-tighter text-white">
          nexus<span className="text-violet-400 font-light">.io</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-4 text-[10px] uppercase tracking-[1px] text-gray-500 mb-3">MAIN</p>

        <NavLink to="/home" className={linkClass} title="Dashboard Sidebar Layout">
          <Home size={18} className="shrink-0" /> Home
        </NavLink>

        {isAdmin && (
          <>
            <p className="px-4 text-[10px] uppercase tracking-[1px] text-gray-500 mt-6 mb-3">ADMIN</p>
            <NavLink to="/dashboard" className={linkClass} title="Dashboard Sidebar Layout">
              <LayoutDashboard size={18} className="shrink-0" /> Dashboard
            </NavLink>
            <NavLink to="/users" className={linkClass} title="Dashboard Sidebar Layout">
              <Users size={18} className="shrink-0" /> Users
            </NavLink>
            <NavLink to="/analytics" className={linkClass} title="Dashboard Sidebar Layout">
              <BarChart2 size={18} className="shrink-0" /> Analytics
            </NavLink>
          </>
        )}

        <NavLink to="/dowry" className={linkClass} title="Dashboard Sidebar Layout">
          <span className="text-amber-400 text-xl">📋</span> Dowry Information
        </NavLink>

        <NavLink to="/chatbot" className={linkClass} title="Chatbot Sidebar Option">
          <Bot size={18} className="shrink-0" /> AI Chatbot
        </NavLink>

        <p className="px-4 text-[10px] uppercase tracking-[1px] text-gray-500 mt-6 mb-3">CONFIG</p>
        <NavLink to="/settings" className={linkClass} title="Dashboard Sidebar Layout">
          <Settings size={18} className="shrink-0" /> Settings
        </NavLink>

        {isAdmin && (
          <NavLink to="/roles" className={linkClass} title="Dashboard Sidebar Layout">
            <ShieldCheck size={18} className="shrink-0" /> Roles
          </NavLink>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 bg-gray-900 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          title="Sign Out"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}