// src/hooks/useAcreditaciones.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
// Removido import directo del servicio - ahora usa APIs
import type {
  FiltrosAcreditacion,
  EstadisticasAcreditacion
} from '@/lib/types/acreditacion.types'
import type {
  AcreditacionWithRelations
} from '@/lib/repositories/acreditacion.repository'
import { AcreditacionService, DashboardData } from '@/lib/services/acreditacion.service'

// Use Prisma types for consistency
type AcreditacionCompleta = AcreditacionWithRelations

// Hook principal para gestionar acreditaciones
export function useAcreditaciones(filtros?: FiltrosAcreditacion) {
  const [acreditaciones, setAcreditaciones] = useState<AcreditacionCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAcreditaciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      if (filtros?.aeropuertoId) params.append('aeropuertoId', filtros.aeropuertoId)
      if (filtros?.estado) params.append('estado', filtros.estado)
      if (filtros?.hasWarning !== undefined) params.append('hasWarning', filtros.hasWarning.toString())
      if (filtros?.solicitante) params.append('solicitante', filtros.solicitante)
      if (filtros?.personal) params.append('personal', filtros.personal)
      if (filtros?.fechaIngresoDesde) params.append('fechaIngresoDesde', filtros.fechaIngresoDesde.toISOString())
      if (filtros?.fechaIngresoHasta) params.append('fechaIngresoHasta', filtros.fechaIngresoHasta.toISOString())
      if (filtros?.fechaVencimientoDesde) params.append('fechaVencimientoDesde', filtros.fechaVencimientoDesde.toISOString())
      if (filtros?.fechaVencimientoHasta) params.append('fechaVencimientoHasta', filtros.fechaVencimientoHasta.toISOString())

      const response = await fetch(`/api/acreditaciones?${params.toString()}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error fetching acreditaciones')
      }

      setAcreditaciones(result.data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching acreditaciones:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchAcreditaciones()
  }, [fetchAcreditaciones])

  const refresh = useCallback(() => {
    fetchAcreditaciones()
  }, [fetchAcreditaciones])

  const updateAcreditacion = useCallback(async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/acreditaciones/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error updating acreditación')
      }

      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [refresh])

  const deleteAcreditacion = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/acreditaciones/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error deleting acreditación')
      }

      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [refresh])

  return {
    acreditaciones,
    loading,
    error,
    refresh,
    updateAcreditacion,
    deleteAcreditacion
  }
}

// Hook específico para el dashboard
export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/acreditaciones/dashboard')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error fetching dashboard data')
      }

      setDashboardData(result.data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const refresh = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    dashboardData,
    loading,
    error,
    refresh
  }
}

// Hook para estadísticas
export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasAcreditacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const acreditacionService = new AcreditacionService()

  const fetchEstadisticas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await acreditacionService.getEstadisticas()
      setEstadisticas(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEstadisticas()
  }, [fetchEstadisticas])

  const refresh = useCallback(() => {
    fetchEstadisticas()
  }, [fetchEstadisticas])

  return {
    estadisticas,
    loading,
    error,
    refresh
  }
}

// Hook para una acreditación específica
export function useAcreditacion(id: string) {
  const [acreditacion, setAcreditacion] = useState<AcreditacionCompleta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const acreditacionService = new AcreditacionService()

  const fetchAcreditacion = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await acreditacionService.getAcreditacionById(id)
      setAcreditacion(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching acreditación:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAcreditacion()
  }, [fetchAcreditacion])

  const refresh = useCallback(() => {
    fetchAcreditacion()
  }, [fetchAcreditacion])

  const updateProgreso = useCallback(async (progreso: number) => {
    if (!id) return

    try {
      await acreditacionService.actualizarProgreso(id, progreso)
      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [id, refresh])

  const aprobar = useCallback(async (aprobadoPor: string) => {
    if (!id) return

    try {
      await acreditacionService.aprobarAcreditacion(id, aprobadoPor)
      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [id, refresh])

  const rechazar = useCallback(async (razon: string, rechazadoPor: string) => {
    if (!id) return

    try {
      await acreditacionService.rechazarAcreditacion(id, razon, rechazadoPor)
      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [id, refresh])

  const marcarDiscrepancia = useCallback(async (discrepancia: string, reportadoPor: string) => {
    if (!id) return

    try {
      await acreditacionService.marcarConDiscrepancia(id, discrepancia, reportadoPor)
      await refresh()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [id, refresh])

  return {
    acreditacion,
    loading,
    error,
    refresh,
    updateProgreso,
    aprobar,
    rechazar,
    marcarDiscrepancia
  }
}

// Hook para búsquedas y filtros
export function useAcreditacionSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtros, setFiltros] = useState<FiltrosAcreditacion>({})
  const [results, setResults] = useState<AcreditacionCompleta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const acreditacionService = new AcreditacionService()

  const search = useCallback(async (term?: string, newFiltros?: FiltrosAcreditacion) => {
    const termToSearch = term !== undefined ? term : searchTerm
    const filtrosToUse = newFiltros !== undefined ? newFiltros : filtros

    try {
      setLoading(true)
      setError(null)

      let searchResults: AcreditacionCompleta[] = []

      if (termToSearch.trim()) {
        // Buscar por número o solicitante
        const [byNumero, bySolicitante] = await Promise.all([
          acreditacionService.buscarPorNumero(termToSearch),
          acreditacionService.buscarPorSolicitante(termToSearch)
        ])

        // Combinar resultados eliminando duplicados
        const combined = [...byNumero, ...bySolicitante]
        searchResults = combined.filter((item, index, arr) =>
          arr.findIndex(t => t.id === item.id) === index
        )
      } else {
        // Sin término de búsqueda, solo filtros
        searchResults = await acreditacionService.getAllAcreditaciones(filtrosToUse)
      }

      setResults(searchResults)
    } catch (err) {
      setError(err as Error)
      console.error('Error searching acreditaciones:', err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtros])

  const updateFilters = useCallback((newFiltros: FiltrosAcreditacion) => {
    setFiltros(newFiltros)
    search(undefined, newFiltros)
  }, [search])

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term)
    search(term)
  }, [search])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setFiltros({})
    setResults([])
  }, [])

  return {
    searchTerm,
    filtros,
    results,
    loading,
    error,
    search,
    updateFilters,
    updateSearchTerm,
    clearSearch
  }
}

// Hook para manejar la paginación
export function useAcreditacionesPaginated(limit: number = 10) {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AcreditacionCompleta[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filtros, setFiltros] = useState<FiltrosAcreditacion>({})

  const acreditacionService = new AcreditacionService()

  const fetchPage = useCallback(async (pageNum?: number, newFiltros?: FiltrosAcreditacion) => {
    const currentPage = pageNum !== undefined ? pageNum : page
    const currentFiltros = newFiltros !== undefined ? newFiltros : filtros

    try {
      setLoading(true)
      setError(null)

      // Simular paginación desde el servicio
      // En una implementación real, el servicio tendría paginación
      const allData = await acreditacionService.getAllAcreditaciones(currentFiltros)
      const start = (currentPage - 1) * limit
      const end = start + limit
      const pageData = allData.slice(start, end)

      setData(pageData)
      setTotal(allData.length)
      setTotalPages(Math.ceil(allData.length / limit))
      setPage(currentPage)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching page:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, filtros])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchPage(pageNum)
    }
  }, [totalPages, fetchPage])

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1)
    }
  }, [page, totalPages, goToPage])

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1)
    }
  }, [page, goToPage])

  const updateFilters = useCallback((newFiltros: FiltrosAcreditacion) => {
    setFiltros(newFiltros)
    setPage(1)
    fetchPage(1, newFiltros)
  }, [fetchPage])

  const refresh = useCallback(() => {
    fetchPage()
  }, [fetchPage])

  return {
    data,
    page,
    total,
    totalPages,
    loading,
    error,
    filtros,
    goToPage,
    nextPage,
    prevPage,
    updateFilters,
    refresh,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}