
// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import ExpenseCalculator from '../components/ui/ExpenseCalculator'

export default function HomePage() {
    const { user, isLoading } = useAuthStore()
    const navigate = useNavigate()

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const isAdmin = user.role === 'admin'

    const quickLinks = [
        // Admins go to the real /dashboard; regular users go to /settings (they have no /dashboard access)
        ...(isAdmin
            ? [
                {
                    icon: LayoutDashboard,
                    title: 'Dashboard',
                    description: 'View dashboard analytics',
                    href: '/dashboard',
                    color: 'bg-violet-500/15 text-violet-400',
                    borderColor: 'border-violet-500/30',
                },
            ]
            : [
                {
                    icon: UserIcon,
                    title: 'My Profile',
                    description: 'View and update your profile',
                    href: '/settings',
                    color: 'bg-violet-500/15 text-violet-400',
                    borderColor: 'border-violet-500/30',
                },
            ]),
        ...(isAdmin
            ? [
                {
                    icon: Users,
                    title: 'User Management',
                    description: 'Manage all users',
                    href: '/users',
                    color: 'bg-emerald-500/15 text-emerald-400',
                    borderColor: 'border-emerald-500/30',
                },
            ]
            : []),
        {
            icon: Settings,
            title: 'Settings',
            description: 'Manage your account settings',
            href: '/settings',
            color: 'bg-amber-500/15 text-amber-400',
            borderColor: 'border-amber-500/30',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-violet-400">
                        nexus<span className="text-white font-light">.io</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 py-12 space-y-10">
                {/* Welcome */}
                <div>
                    <h2 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h2>
                    <p className="text-gray-400">
                        {isAdmin
                            ? 'You have admin access. Manage users and view analytics.'
                            : 'Explore your dashboard and manage your account.'}
                    </p>
                </div>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700">
                    <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-violet-400' : 'bg-emerald-400'}`} />
                    <span className="text-sm text-gray-300">
                        {isAdmin ? 'Administrator Account' : 'User Account'}
                    </span>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map(({ icon: Icon, title, description, href, color, borderColor }) => (
                        <button
                            key={`${href}-${title}`}
                            onClick={() => navigate(href)}
                            className={`p-6 rounded-xl border transition-all hover:scale-105 hover:shadow-lg ${borderColor} bg-gray-900/50 text-left group`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-400">{description}</p>
                        </button>
                    ))}
                </div>

                {/* Expense Calculator */}
                <ExpenseCalculator />

                {/* Account Info */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Full Name</p>
                            <p className="text-white font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Email</p>
                            <p className="text-white font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Role</p>
                            <p className="text-white font-medium capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className={`font-medium capitalize ${user.status === 'active' ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {user.status}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}