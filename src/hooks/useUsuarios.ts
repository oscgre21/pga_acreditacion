// src/hooks/useUsuarios.ts
import useSWR from 'swr'
import { Usuario } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useUsuarios() {
  const { data, error, isLoading, mutate } = useSWR<Usuario[]>(
    '/api/usuarios',
    fetcher
  )

  return {
    usuarios: data,
    isLoading,
    error,
    refresh: mutate
  }
}

export function useUsuario(id: number) {
  const { data, error, isLoading } = useSWR<Usuario>(
    id ? `/api/usuarios/${id}` : null,
    fetcher
  )

  return {
    usuario: data,
    isLoading,
    error
  }
}