// src/components/layout/Layout.tsx
// Drop-in replacement — wraps all authenticated pages.
// On mobile:  sidebar is a slide-in drawer; main content takes full width.
// On desktop: sidebar is always visible on the left.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar'; // keep your existing Topbar

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar — handles its own responsive visibility */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — add pl-12 on mobile to make room for hamburger button */}
        <div className="pl-12 md:pl-0">
          <Topbar />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}