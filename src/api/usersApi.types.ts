export type Role = 'admin' | 'user'

export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  avatar?: string
  createdAt: string
  lastLogin?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: Role
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: Role
  status?: UserStatus
  avatar?: string
}

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: Role | 'all'
  status?: UserStatus | 'all'
}

export interface PaginatedUsers {
  users: User[]
  total: number
  page: number
  totalPages: number
}