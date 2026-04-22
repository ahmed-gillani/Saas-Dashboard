// src/components/layout/Sidebar.tsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users, BarChart2,
  Settings, ShieldCheck, LogOut, ClipboardList, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  // Mobile drawer state
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm border-l-2 transition-all ${
      isActive
        ? 'text-violet-400 bg-violet-500/10 border-violet-500'
        : 'text-gray-500 border-transparent hover:text-gray-200 hover:bg-gray-800/50'
    }`;

  const sectionLabel = (text: string) => (
    <p className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-gray-600">
      {text}
    </p>
  );

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between">
        <span className="text-violet-400 font-bold text-lg tracking-tight">
          nexus<span className="text-white font-light">.io</span>
        </span>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-200 transition-colors p-1"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto">
        {sectionLabel('Navigation')}
        <NavLink to="/home" className={linkClass}>
          <Home size={15} className="shrink-0" /> Home
        </NavLink>

        {isAdmin && (
          <>
            {sectionLabel('Admin')}
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={15} className="shrink-0" /> Dashboard
            </NavLink>
            <NavLink to="/users" className={linkClass}>
              <Users size={15} className="shrink-0" /> Users
            </NavLink>
            <NavLink to="/analytics" className={linkClass}>
              <BarChart2 size={15} className="shrink-0" /> Analytics
            </NavLink>
          </>
        )}

        <NavLink to="/dowry" className={linkClass}>
          <ClipboardList size={15} className="shrink-0" /> Dowry Information
        </NavLink>

        {sectionLabel('Config')}
        <NavLink to="/settings" className={linkClass}>
          <Settings size={15} className="shrink-0" /> Settings
        </NavLink>
        {isAdmin && (
          <NavLink to="/roles" className={linkClass}>
            <ShieldCheck size={15} className="shrink-0" /> Roles
          </NavLink>
        )}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-800 space-y-1 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-gray-800">
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── MOBILE HAMBURGER BUTTON ─────────────────────────────── */}
      {/* Sits in the top-bar on mobile — rendered here, positioned via layout */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-50 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* ── BACKDROP (mobile) ────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* ── MOBILE DRAWER ────────────────────────────────────────── */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-64
          bg-gray-900 border-r border-gray-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <NavContent />
      </aside>

      {/* ── DESKTOP SIDEBAR (always visible at md+) ──────────────── */}
      <aside className="hidden md:flex w-52 bg-gray-900 border-r border-gray-800 flex-col h-full shrink-0">
        <NavContent />
      </aside>
    </>
  );
}