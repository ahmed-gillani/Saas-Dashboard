// import { useAuthStore } from '../../store/authStore';
// import { Users, Shield, BarChart2, Home as HomeIcon } from 'lucide-react';

// export default function HomePage() {
//   const { user } = useAuthStore();

//   return (
//     <div className="space-y-8">
//       <div className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-gray-800 rounded-3xl p-10 text-center">
//         <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
//           <HomeIcon size={32} className="text-white" />
//         </div>
//         <h1 className="text-4xl font-bold text-white mb-2">
//           Welcome back, {user?.name}!
//         </h1>
//         <p className="text-xl text-gray-400">
//           You are logged in as{' '}
//           <span className="capitalize font-semibold text-violet-400">{user?.role}</span>
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
//               <Users size={22} className="text-emerald-400" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">Your Role</p>
//               <p className="text-2xl font-semibold capitalize">{user?.role}</p>
//             </div>
//           </div>
//         </div>

//         {user?.role === 'admin' && (
//           <>
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
//                   <Shield size={22} className="text-violet-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Admin Access</p>
//                   <p className="text-2xl font-semibold">Full Dashboard</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
//                   <BarChart2 size={22} className="text-amber-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Quick Stats</p>
//                   <p className="text-2xl font-semibold">Everything at a glance</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {user?.role === 'user' && (
//           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 col-span-2">
//             <p className="text-gray-400 text-lg">
//               You have access to your profile and settings. Contact an admin if you need more permissions.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/home/HomePage.tsx
import { useAuthStore } from '../../store/authStore';
import { Users, Shield, BarChart2, Home as HomeIcon } from 'lucide-react';
import ExpenseCalculator from '../../components/ui/ExpenseCalculator';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-gray-800 rounded-3xl p-10 text-center">
        <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
          <HomeIcon size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xl text-gray-400">
          You are logged in as{' '}
          <span className="capitalize font-semibold text-violet-400">{user?.role}</span>
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Your Role</p>
              <p className="text-2xl font-semibold capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <Shield size={22} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Admin Access</p>
                  <p className="text-2xl font-semibold">Full Dashboard</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <BarChart2 size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Quick Stats</p>
                  <p className="text-2xl font-semibold">Everything at a glance</p>
                </div>
              </div>
            </div>
          </>
        )}

        {user?.role === 'user' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 col-span-2">
            <p className="text-gray-400 text-lg">
              You have access to your profile and settings. Contact an admin if you need more permissions.
            </p>
          </div>
        )}
      </div>

      {/* Expense Calculator — visible to all logged-in users */}
      <ExpenseCalculator />
    </div>
  );
}