// // src/App.tsx
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { useEffect } from 'react';

// import LoginPage from './pages/auth/LoginPage';
// import SignupPage from './pages/auth/SignupPage';
// import AuthGuard from './components/auth/AuthGuard';
// import DashboardLayout from './components/layout/DashboardLayout';

// import HomePage from './pages/HomePage';
// import DashboardPage from './pages/dashboard/DashboardPage';
// import UsersPage from './pages/users/userPage';
// import AnalyticsPage from './pages/analytics/AnalyticsPage';
// import RolesPage from './pages/RolesPage';
// import SettingsPage from './pages/settings/SettingsPage';
// import DowryPage from './pages/dowry/DowryPage';
// import ChatbotPage from './pages/chatbot/ChatbotPage';   // ← Chatbot

// import { useAuthStore } from './store/authStore';
// import { auth } from './lib/firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: { retry: 1, staleTime: 5 * 60 * 1000 },
//   },
// });

// function AppContent() {
//   const { isAuthenticated, isLoading, setAuth, logout } = useAuthStore();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           const token = await firebaseUser.getIdToken();
//           const { getDoc, doc } = await import('firebase/firestore');
//           const { db } = await import('./lib/firebase');

//           const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));

//           let userData: any;
//           if (userSnap.exists()) {
//             userData = { id: firebaseUser.uid, ...userSnap.data() };
//           } else {
//             userData = {
//               id: firebaseUser.uid,
//               name: firebaseUser.email?.split('@')[0] || 'User',
//               email: firebaseUser.email || '',
//               role: 'customer',
//               status: 'active',
//               createdAt: new Date().toISOString(),
//             };
//           }

//           setAuth(userData, token);
//         } catch (err) {
//           console.error('❌ Auth listener error:', err);
//           logout();
//         }
//       } else {
//         logout();
//       }
//     });

//     return () => unsubscribe();
//   }, [setAuth, logout]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <div className="text-white">Loading Nexus.io...</div>
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" replace />} />
//       <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/home" replace />} />

//       <Route element={<AuthGuard />}>
//         <Route element={<DashboardLayout />}>
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/users" element={<UsersPage />} />
//           <Route path="/analytics" element={<AnalyticsPage />} />
//           <Route path="/roles" element={<RolesPage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//           <Route path="/dowry" element={<DowryPage />} />
          
//           {/* Chatbot Routes */}
//           <Route path="/chatbot" element={<ChatbotPage />} />
//           <Route path="/chatbot/:id" element={<ChatbotPage />} />
//         </Route>
//       </Route>

//       <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <AppContent />
//       </BrowserRouter>
//       <Toaster position="top-right" />
//     </QueryClientProvider>
//   );
// }

// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AuthGuard from './components/auth/AuthGuard';
import DashboardLayout from './components/layout/DashboardLayout';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/userPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import RolesPage from './pages/RolesPage';
import SettingsPage from './pages/settings/SettingsPage';
import DowryPage from './pages/dowry/DowryPage';
import ChatbotPage from './pages/chatbot/ChatbotPage';

import { useAuthStore } from './store/authStore';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Make queryClient globally accessible for logout
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

function AppContent() {
  const { isAuthenticated, isLoading, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const { getDoc, doc } = await import('firebase/firestore');
          const { db } = await import('./lib/firebase');

          const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));

          let userData: any;
          if (userSnap.exists()) {
            userData = { id: firebaseUser.uid, ...userSnap.data() };
          } else {
            userData = {
              id: firebaseUser.uid,
              name: firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'customer',
              status: 'active',
              createdAt: new Date().toISOString(),
            };
          }

          setAuth(userData, token);
        } catch (err) {
          console.error('❌ Auth listener error:', err);
          logout();
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [setAuth, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading Nexus.io...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/home" replace />} />

      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dowry" element={<DowryPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/chatbot/:id" element={<ChatbotPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}