// src/lib/services/acreditacion.service.ts
import { EstadoAcreditacion } from '@prisma/client'
import {
  AcreditacionRepository,
  FiltrosAcreditacion,
  EstadisticasAcreditacion,
  CreateAcreditacionData,
  UpdateAcreditacionData,
  AcreditacionWithRelations
} from '@/lib/repositories/acreditacion.repository'
import { AeropuertoRepository } from '@/lib/repositories/aeropuerto.repository'
import { NotificacionService } from './notificacion.service'
import { prisma } from '@/lib/prisma'

export interface DashboardData {
  estadisticas: EstadisticasAcreditacion
  tramitesRecientes: AcreditacionWithRelations[]
  proximasAVencer: AcreditacionWithRelations[]
  conDiscrepancias: AcreditacionWithRelations[]
  distribucionAeropuertos: Array<{
    aeropuerto: string
    codigo: string
    cantidad: number
    porcentaje: number
  }>
}

export interface CreateAcreditacionRequest {
  numero: string
  solicitante: string
  personal?: string
  aeropuertoId: string
  categoria: string
  proceso: string
  subproceso: string
  referencia: string
  fechaVencimiento: Date
  ejecutores: string[]
  validadores: string[]
  observaciones?: string
  costoUSD?: number
}

export interface UpdateAcreditacionRequest {
  solicitante?: string
  personal?: string
  aeropuertoId?: string
  categoria?: string
  proceso?: string
  subproceso?: string
  estado?: EstadoAcreditacion
  progreso?: number
  fechaVencimiento?: Date
  ejecutores?: string[]
  validadores?: string[]
  observaciones?: string
  costoUSD?: number
  hasWarning?: boolean
}

export class AcreditacionService {
  private acreditacionRepo: AcreditacionRepository
  private aeropuertoRepo: AeropuertoRepository
  private notificacionService: NotificacionService

  constructor() {
    this.acreditacionRepo = new AcreditacionRepository(prisma)
    this.aeropuertoRepo = new AeropuertoRepository(prisma)
    this.notificacionService = new NotificacionService(prisma)
  }

  // === OPERACIONES CRUD BÁSICAS ===

  async getAllAcreditaciones(filtros?: FiltrosAcreditacion): Promise<AcreditacionWithRelations[]> {
    return this.acreditacionRepo.findWithFilters(filtros, {
      aeropuerto: true,
      documentos: true,
      actividades: {
        orderBy: { orden: 'asc' }
      }
    })
  }

  async getAcreditacionById(id: string): Promise<AcreditacionWithRelations | null> {
    const result = await this.acreditacionRepo.findById(id, {
      aeropuerto: true,
      documentos: true,
      actividades: {
        orderBy: { orden: 'asc' }
      }
    })
    return result as AcreditacionWithRelations | null
  }

  async createAcreditacion(data: CreateAcreditacionRequest): Promise<AcreditacionWithRelations> {
    // Validar que el aeropuerto existe
    const aeropuerto = await this.aeropuertoRepo.findById(data.aeropuertoId)
    if (!aeropuerto) {
      throw new Error(`Aeropuerto con ID ${data.aeropuertoId} no encontrado`)
    }

    // Validar que el número es único
    const existeNumero = await this.acreditacionRepo.findMany({ numero: data.numero })
    if (existeNumero.length > 0) {
      throw new Error(`Ya existe una acreditación con el número ${data.numero}`)
    }

    const nuevaAcreditacion = await this.acreditacionRepo.create({
      numero: data.numero,
      solicitante: data.solicitante,
      personal: data.personal,
      aeropuerto: { connect: { id: data.aeropuertoId } },
      categoria: data.categoria,
      proceso: data.proceso,
      subproceso: data.subproceso,
      referencia: data.referencia,
      fechaIngreso: new Date(),
      fechaVencimiento: data.fechaVencimiento,
      ejecutores: data.ejecutores,
      validadores: data.validadores,
      observaciones: data.observaciones,
      costoUSD: data.costoUSD
    })

    // Crear actividades iniciales del proceso
    await this.crearActividadesIniciales(nuevaAcreditacion.id)

    // TODO: Crear notificación para los ejecutores
    // await this.notificacionService.notificarNuevaAcreditacion(
    //   nuevaAcreditacion.id,
    //   data.ejecutores
    // )

    return this.getAcreditacionById(nuevaAcreditacion.id) as Promise<AcreditacionWithRelations>
  }

  async updateAcreditacion(id: string, data: UpdateAcreditacionRequest): Promise<AcreditacionWithRelations> {
    const acreditacion = await this.acreditacionRepo.findById(id)
    if (!acreditacion) {
      throw new Error(`Acreditación con ID ${id} no encontrada`)
    }

    // Si se cambia el aeropuerto, validar que existe
    if (data.aeropuertoId && data.aeropuertoId !== acreditacion.aeropuertoId) {
      const aeropuerto = await this.aeropuertoRepo.findById(data.aeropuertoId)
      if (!aeropuerto) {
        throw new Error(`Aeropuerto con ID ${data.aeropuertoId} no encontrado`)
      }
    }

    const updateData: UpdateAcreditacionData = {}

    // Mapear campos básicos
    if (data.solicitante !== undefined) updateData.solicitante = data.solicitante
    if (data.personal !== undefined) updateData.personal = data.personal
    if (data.categoria !== undefined) updateData.categoria = data.categoria
    if (data.proceso !== undefined) updateData.proceso = data.proceso
    if (data.subproceso !== undefined) updateData.subproceso = data.subproceso
    if (data.estado !== undefined) updateData.estado = data.estado
    if (data.progreso !== undefined) updateData.progreso = data.progreso
    if (data.fechaVencimiento !== undefined) updateData.fechaVencimiento = data.fechaVencimiento
    if (data.ejecutores !== undefined) updateData.ejecutores = data.ejecutores
    if (data.validadores !== undefined) updateData.validadores = data.validadores
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones
    if (data.costoUSD !== undefined) updateData.costoUSD = data.costoUSD
    if (data.hasWarning !== undefined) updateData.hasWarning = data.hasWarning

    // Conectar aeropuerto si cambió
    if (data.aeropuertoId) {
      updateData.aeropuerto = { connect: { id: data.aeropuertoId } }
    }

    const acreditacionActualizada = await this.acreditacionRepo.update(id, updateData)

    // TODO: Notificar cambios importantes
    // if (data.estado && data.estado !== acreditacion.estado) {
    //   await this.notificacionService.notificarCambioEstado(
    //     id,
    //     acreditacion.estado,
    //     data.estado,
    //     acreditacion.validadores
    //   )
    // }

    return this.getAcreditacionById(id) as Promise<AcreditacionWithRelations>
  }

  async deleteAcreditacion(id: string): Promise<void> {
    const acreditacion = await this.acreditacionRepo.findById(id)
    if (!acreditacion) {
      throw new Error(`Acreditación con ID ${id} no encontrada`)
    }

    await this.acreditacionRepo.delete(id)
  }

  // === OPERACIONES ESPECÍFICAS DEL NEGOCIO ===

  async aprobarAcreditacion(id: string, aprobadoPor: string): Promise<AcreditacionWithRelations> {
    const acreditacion = await this.acreditacionRepo.findById(id)
    if (!acreditacion) {
      throw new Error(`Acreditación con ID ${id} no encontrada`)
    }

    if (acreditacion.estado === EstadoAcreditacion.APROBADO) {
      throw new Error('La acreditación ya está aprobada')
    }

    const acreditacionAprobada = await this.acreditacionRepo.update(id, {
      estado: EstadoAcreditacion.APROBADO,
      progreso: 100,
      observaciones: `${acreditacion.observaciones || ''}\n\nAprobado por: ${aprobadoPor} el ${new Date().toLocaleDateString()}`
    })

    // TODO: Notificar aprobación
    // await this.notificacionService.notificarAprobacion(id, [acreditacion.solicitante])

    return this.getAcreditacionById(id) as Promise<AcreditacionWithRelations>
  }

  async rechazarAcreditacion(id: string, razon: string, rechazadoPor: string): Promise<AcreditacionWithRelations> {
    const acreditacion = await this.acreditacionRepo.findById(id)
    if (!acreditacion) {
      throw new Error(`Acreditación con ID ${id} no encontrada`)
    }

    const acreditacionRechazada = await this.acreditacionRepo.update(id, {
      estado: EstadoAcreditacion.RECHAZADO,
      hasWarning: true,
      observaciones: `${acreditacion.observaciones || ''}\n\nRechazado por: ${rechazadoPor} el ${new Date().toLocaleDateString()}\nRazón: ${razon}`
    })

    // TODO: Notificar rechazo
    // await this.notificacionService.notificarRechazo(id, razon, [acreditacion.solicitante])

    return this.getAcreditacionById(id) as Promise<AcreditacionWithRelations>
  }

  async marcarConDiscrepancia(id: string, discrepancia: string, reportadoPor: string): Promise<AcreditacionWithRelations> {
    const acreditacion = await this.acreditacionRepo.findById(id)
    if (!acreditacion) {
      throw new Error(`Acreditación con ID ${id} no encontrada`)
    }

    const acreditacionConDiscrepancia = await this.acreditacionRepo.update(id, {
      hasWarning: true,
      estado: EstadoAcreditacion.EN_REVISION,
      observaciones: `${acreditacion.observaciones || ''}\n\nDiscrepancia reportada por: ${reportadoPor} el ${new Date().toLocaleDateString()}\nDetalle: ${discrepancia}`
    })

    // TODO: Notificar discrepancia a ejecutores y validadores
    // await this.notificacionService.notificarDiscrepancia(
    //   id,
    //   discrepancia,
    //   [...acreditacion.ejecutores, ...acreditacion.validadores]
    // )

    return this.getAcreditacionById(id) as Promise<AcreditacionWithRelations>
  }

  async actualizarProgreso(id: string, progreso: number): Promise<AcreditacionWithRelations> {
    if (progreso < 0 || progreso > 100) {
      throw new Error('El progreso debe estar entre 0 y 100')
    }

    // Determinar estado según progreso
    let nuevoEstado: EstadoAcreditacion = EstadoAcreditacion.PENDIENTE
    if (progreso === 100) {
      nuevoEstado = EstadoAcreditacion.VALIDACION_FINAL
    } else if (progreso >= 50) {
      nuevoEstado = EstadoAcreditacion.EN_PROCESO
    }

    await this.acreditacionRepo.update(id, {
      progreso,
      estado: nuevoEstado
    })

    return this.getAcreditacionById(id) as Promise<AcreditacionWithRelations>
  }

  // === CONSULTAS PARA DASHBOARD ===

  async getDashboardData(): Promise<DashboardData> {
    const [
      estadisticas,
      tramitesRecientes,
      proximasAVencer,
      conDiscrepancias,
      distribucionAeropuertos
    ] = await Promise.all([
      this.acreditacionRepo.getEstadisticas(),
      this.acreditacionRepo.findWithFilters({}, { aeropuerto: true }),
      this.acreditacionRepo.findProximasAVencer(7),
      this.acreditacionRepo.findConDiscrepancias(),
      this.aeropuertoRepo.getDistribucionAcreditaciones()
    ])

    return {
      estadisticas,
      tramitesRecientes: tramitesRecientes.slice(0, 10), // Solo los 10 más recientes
      proximasAVencer: proximasAVencer || [],
      conDiscrepancias: conDiscrepancias || [],
      distribucionAeropuertos
    }
  }

  async getEstadisticas(): Promise<EstadisticasAcreditacion> {
    return this.acreditacionRepo.getEstadisticas()
  }

  // === UTILIDADES PRIVADAS ===

  private async crearActividadesIniciales(acreditacionId: string): Promise<void> {
    const actividadesIniciales = [
      {
        nombre: 'Recepción de documentos',
        descripcion: 'Recepción y validación inicial de documentos requeridos',
        orden: 1
      },
      {
        nombre: 'Revisión técnica',
        descripcion: 'Revisión técnica de la documentación y requisitos',
        orden: 2
      },
      {
        nombre: 'Validación de campo',
        descripcion: 'Validación en campo de los servicios o instalaciones',
        orden: 3
      },
      {
        nombre: 'Aprobación final',
        descripcion: 'Aprobación final y emisión de certificación',
        orden: 4
      }
    ]

    // TODO: Crear actividades usando el repository apropiado
    // Para ahora, las actividades se pueden crear manualmente
    // O crear un ActividadRepository dedicado
    console.log(`Crear ${actividadesIniciales.length} actividades para acreditación ${acreditacionId}`)
  }

  // === BÚSQUEDAS Y FILTROS ===

  async buscarPorNumero(numero: string): Promise<AcreditacionWithRelations[]> {
    return this.acreditacionRepo.findWithFilters({}, {
      aeropuerto: true,
      documentos: true,
      actividades: true
    }).then(acreditaciones =>
      acreditaciones.filter(a => a.numero.toLowerCase().includes(numero.toLowerCase()))
    )
  }

  async buscarPorSolicitante(solicitante: string): Promise<AcreditacionWithRelations[]> {
    return this.acreditacionRepo.findWithFilters(
      { solicitante },
      { aeropuerto: true, documentos: true, actividades: true }
    )
  }

  async getAcreditacionesPorAeropuerto(aeropuertoId: string): Promise<AcreditacionWithRelations[]> {
    return this.acreditacionRepo.findWithFilters(
      { aeropuertoId },
      { aeropuerto: true, documentos: true, actividades: true }
    )
  }

  async getAcreditacionesPorEstado(estado: EstadoAcreditacion): Promise<AcreditacionWithRelations[]> {
    return this.acreditacionRepo.findWithFilters(
      { estado },
      { aeropuerto: true, documentos: true, actividades: true }
    )
  }

  // === REPORTES ===

  async getReporteVencimientos(dias: number = 30): Promise<AcreditacionWithRelations[]> {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + dias)

    const acreditaciones = await this.acreditacionRepo.findWithFilters(
      {
        fechaVencimientoHasta: fechaLimite
      },
      { aeropuerto: true }
    )

    // Filter by estado manually since the repository filter might not support complex queries
    return acreditaciones.filter(a =>
      a.estado === EstadoAcreditacion.PENDIENTE ||
      a.estado === EstadoAcreditacion.EN_PROCESO
    )
  }

  async getReporteProducividad(fechaInicio: Date, fechaFin: Date): Promise<{
    totalProcesadas: number
    aprobadas: number
    rechazadas: number
    enProceso: number
    tiempoPromedio: number
    porAeropuerto: Array<{
      aeropuerto: string
      total: number
      aprobadas: number
      porcentajeExito: number
    }>
  }> {
    const acreditaciones = await this.acreditacionRepo.findWithFilters(
      {
        fechaIngresoDesde: fechaInicio,
        fechaIngresoHasta: fechaFin
      },
      { aeropuerto: true }
    )

    const totalProcesadas = acreditaciones.length
    const aprobadas = acreditaciones.filter(a => a.estado === EstadoAcreditacion.APROBADO).length
    const rechazadas = acreditaciones.filter(a => a.estado === EstadoAcreditacion.RECHAZADO).length
    const enProceso = acreditaciones.filter(a =>
      [EstadoAcreditacion.PENDIENTE, EstadoAcreditacion.EN_PROCESO, EstadoAcreditacion.EN_REVISION, EstadoAcreditacion.DOCUMENTOS_INCOMPLETOS, EstadoAcreditacion.VALIDACION_FINAL].includes(a.estado)
    ).length

    // Calcular tiempo promedio de las aprobadas
    const acreditacionesAprobadas = acreditaciones.filter(a => a.estado === EstadoAcreditacion.APROBADO)
    let tiempoPromedio = 0
    if (acreditacionesAprobadas.length > 0) {
      const tiempoTotal = acreditacionesAprobadas.reduce((total, a) => {
        const dias = Math.floor((a.updatedAt.getTime() - a.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
        return total + dias
      }, 0)
      tiempoPromedio = tiempoTotal / acreditacionesAprobadas.length
    }

    // Agrupar por aeropuerto
    const porAeropuerto = Object.values(
      acreditaciones.reduce((acc, a) => {
        const key = a.aeropuertoId
        if (!acc[key]) {
          acc[key] = {
            aeropuerto: a.aeropuerto.nombre,
            total: 0,
            aprobadas: 0,
            porcentajeExito: 0
          }
        }
        acc[key].total++
        if (a.estado === EstadoAcreditacion.APROBADO) {
          acc[key].aprobadas++
        }
        acc[key].porcentajeExito = Math.round((acc[key].aprobadas / acc[key].total) * 100)
        return acc
      }, {} as Record<string, any>)
    )

    return {
      totalProcesadas,
      aprobadas,
      rechazadas,
      enProceso,
      tiempoPromedio: Math.round(tiempoPromedio),
      porAeropuerto
    }
  }
}