import { create } from 'zustand'
import type { Notification } from '../types/auth.types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (n: Notification[]) => void
  markRead: (id: string) => void
  markAllRead: () => void
  removeOne: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length }
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeOne: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id)
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length }
    }),
}))