import type { AuthResponse, LoginInput, SignupInput, User } from '../types/auth.types'
import axiosInstance from './axiosInstance'

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupInput): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken })
    return response.data
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/reset-password', { token, password })
    return response.data
  },
}