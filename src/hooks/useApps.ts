// src/hooks/useApps.ts
import useSWR from 'swr'
import { App } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useApps() {
  const { data, error, isLoading, mutate } = useSWR<App[]>(
    '/api/apps',
    fetcher
  )

  return {
    apps: data,
    isLoading,
    error,
    refresh: mutate
  }
}