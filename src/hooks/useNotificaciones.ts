// src/hooks/useNotificaciones.ts
import useSWR from 'swr'
import { Notificacion } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNotificaciones() {
  const { data, error, isLoading, mutate } = useSWR<Notificacion[]>(
    '/api/notificaciones',
    fetcher
  )

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notificaciones', {
        method: 'PATCH',
      })
      mutate() // Refresh data
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const unreadCount = data?.filter(n => !n.leida).length || 0

  return {
    notificaciones: data,
    isLoading,
    error,
    markAllAsRead,
    unreadCount,
    refresh: mutate
  }
}