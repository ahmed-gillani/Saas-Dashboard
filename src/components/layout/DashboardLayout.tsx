// // src/components/layout/DashboardLayout.tsx
// import { Outlet, useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import { Menu, X } from 'lucide-react';

// import Sidebar from './Sidebar';
// import Topbar from './Topbar';

// const pageTitles: Record<string, string> = {
//   '/home': 'Home',
//   '/dashboard': 'Dashboard',
//   '/users': 'User Management',
//   '/analytics': 'Analytics',
//   '/settings': 'Settings',
//   '/roles': 'Roles & Access',
//   '/dowry': 'Dowry Information',
// };

// export default function DashboardLayout() {
//   const { pathname } = useLocation();
//   const title = pageTitles[pathname] ?? 'Dashboard';

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-950 overflow-hidden relative">
      
//       {/* Mobile Hamburger for Dashboard Sidebar */}
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white shadow-lg hover:bg-gray-800 transition-colors"
//         title="Dashboard Sidebar Layout"   // ← Your requested label
//       >
//         {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <div className={`fixed md:static inset-y-0 left-0 z-40 w-52 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ${
//         sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//       }`}>
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <Topbar title={title} />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black/60 z-30"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// src/components/layout/DashboardLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles: Record<string, string> = {
  '/home': 'Home',
  '/dashboard': 'Dashboard',
  '/users': 'User Management',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/roles': 'Roles & Access',
  '/dowry': 'Dowry Information',
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Dashboard';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden relative">
      
      {/* Mobile Hamburger for Dashboard Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 border border-gray-700 rounded-2xl text-white shadow-xl hover:bg-gray-800 transition-all"
        title="Dashboard Sidebar Layout"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-40 w-56 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}