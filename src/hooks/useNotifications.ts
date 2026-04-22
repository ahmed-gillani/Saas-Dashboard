import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { notificationsApi } from '../api/notificationsApi'
import { useNotificationStore } from '../store/notificationStore'
import toast from 'react-hot-toast'

export function useNotifications() {
  const { setNotifications, markRead, markAllRead, removeOne } = useNotificationStore()
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll,
    refetchInterval: 30_000,   // har 30 sec mein auto-refresh
  })

  useEffect(() => {
    if (data) setNotifications(data)
  }, [data, setNotifications])

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, id) => {
      markRead(id)
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      markAllRead()
      toast.success('Sab notifications read ho gayi!')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: (_, id) => {
      removeOne(id)
    },
  })

  return {
    markAsRead: (id: string) => markReadMutation.mutate(id),
    markAllAsRead: () => markAllMutation.mutate(),
    deleteNotification: (id: string) => deleteMutation.mutate(id),
  }
}