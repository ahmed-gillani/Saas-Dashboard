import { useState } from 'react'
import { Shield, Check, X } from 'lucide-react'

interface RoleInfo {
    name: string
    description: string
    permissions: string[]
    color: string
    bgColor: string
}

const ROLES: RoleInfo[] = [
    {
        name: 'Admin',
        description: 'Full system access with complete control',
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/15',
        permissions: [
            'Manage users',
            'View dashboard',
            'Access analytics',
            'Manage roles & permissions',
            'System settings',
            'User activity logs',
            'Export reports',
            'Configure notifications',
        ],
    },
    {
        name: 'User',
        description: 'Standard user with limited access',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/15',
        permissions: [
            'View own dashboard',
            'Edit profile',
            'Access notifications',
            'View personal analytics',
            'Download personal reports',
        ],
    },
]

const ALL_PERMISSIONS = [
    'Manage users',
    'View dashboard',
    'Access analytics',
    'Manage roles & permissions',
    'System settings',
    'User activity logs',
    'Export reports',
    'Configure notifications',
    'Edit profile',
    'View own dashboard',
    'Access notifications',
    'View personal analytics',
    'Download personal reports',
]

export default function RolesPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null)

    const selectedRoleInfo = ROLES.find((r) => r.name === selectedRole)

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">
                    <Shield size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
                    <p className="text-sm text-gray-400">Manage system roles and their access levels</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Role List */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Roles</h2>
                        <div className="space-y-2">
                            {ROLES.map((role) => (
                                <button
                                    key={role.name}
                                    onClick={() => setSelectedRole(role.name)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedRole === role.name
                                            ? `${role.bgColor} border-transparent`
                                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                        }`}
                                >
                                    <p className={`font-medium ${selectedRole === role.name ? role.color : 'text-gray-300'}`}>
                                        {role.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{role.permissions.length} permissions</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Role Details */}
                <div className="lg:col-span-2">
                    {selectedRoleInfo ? (
                        <div className="space-y-4">
                            {/* Role Header */}
                            <div className={`${selectedRoleInfo.bgColor} border border-gray-700 rounded-xl p-6`}>
                                <h2 className={`text-2xl font-bold ${selectedRoleInfo.color} mb-2`}>
                                    {selectedRoleInfo.name}
                                </h2>
                                <p className="text-gray-300">{selectedRoleInfo.description}</p>
                            </div>

                            {/* Permissions Card */}
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                                    Permissions ({selectedRoleInfo.permissions.length})
                                </h3>

                                {/* Permission Grid */}
                                <div className="space-y-2 mb-6">
                                    {ALL_PERMISSIONS.map((permission) => {
                                        const hasPermission = selectedRoleInfo.permissions.includes(permission)
                                        return (
                                            <div
                                                key={permission}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${hasPermission
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-gray-700 text-gray-500'
                                                        }`}
                                                >
                                                    {hasPermission ? (
                                                        <Check size={14} />
                                                    ) : (
                                                        <X size={14} />
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-sm ${hasPermission ? 'text-gray-200' : 'text-gray-500'
                                                        }`}
                                                >
                                                    {permission}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Summary */}
                                <div className="pt-4 border-t border-gray-700">
                                    <p className="text-xs text-gray-400">
                                        This role has access to{' '}
                                        <span className="text-white font-medium">
                                            {selectedRoleInfo.permissions.length}
                                        </span>{' '}
                                        out of{' '}
                                        <span className="text-white font-medium">
                                            {ALL_PERMISSIONS.length}
                                        </span>{' '}
                                        available permissions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                            <Shield size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">Select a role to view its permissions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
