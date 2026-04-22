// export type Role = 'admin' | 'user'
// export type UserStatus = 'active' | 'inactive'

// export interface User {
//   id: string
//   name: string
//   email: string
//   role: Role
//   status: UserStatus
//   avatar?: string
//   createdAt: string
//   lastLogin?: string
// }

// export interface AuthResponse {
//   user: User
//   accessToken: string
//   refreshToken: string
// }

// export interface LoginInput {
//   email: string
//   password: string
// }

// export interface SignupInput {
//   name: string
//   email: string
//   password: string
//   confirmPassword: string
// }

// export interface ApiError {
//   message: string
//   statusCode: number
//   errors?: Record<string, string>
// }

// // ── Notification ──────────────────────────────────────────────────────────────
// export interface Notification {
//   id: string
//   title: string
//   message: string
//   type: 'info' | 'success' | 'warning' | 'error'
//   isRead: boolean
//   createdAt: string
// }
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

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  password: string
  role: 'admin' | 'user'          // ← NEW: role selection on signup
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}