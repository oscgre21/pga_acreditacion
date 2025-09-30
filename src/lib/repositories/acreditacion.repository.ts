// src/lib/repositories/acreditacion.repository.ts
import { Acreditacion, EstadoAcreditacion, Prisma, PrismaClient } from '@prisma/client'
import { BaseRepository } from './base.repository'

// Tipos para las operaciones del repository
export type AcreditacionWithRelations = Prisma.AcreditacionGetPayload<{
  include: {
    aeropuerto: true
    documentos: true
    actividades: true
  }
}>

export type CreateAcreditacionData = Prisma.AcreditacionCreateInput
export type UpdateAcreditacionData = Prisma.AcreditacionUpdateInput

export interface FiltrosAcreditacion {
  aeropuertoId?: string
  estado?: EstadoAcreditacion
  hasWarning?: boolean
  fechaIngresoDesde?: Date
  fechaIngresoHasta?: Date
  fechaVencimientoDesde?: Date
  fechaVencimientoHasta?: Date
  solicitante?: string
  personal?: string
}

export interface EstadisticasAcreditacion {
  total: number
  concluidas: number
  enTiempo: number
  atrasadas: number
  discrepancias: number
  porAeropuerto: Array<{
    aeropuertoId: string
    aeropuertoNombre: string
    cantidad: number
    porcentaje: number
  }>
  porEstado: Array<{
    estado: EstadoAcreditacion
    cantidad: number
    porcentaje: number
  }>
  tiempoPromedioProcesso: number // en días
}

export class AcreditacionRepository extends BaseRepository<Acreditacion> {
  protected modelName = 'acreditacion';

  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  // Buscar acreditaciones con filtros
  async findWithFilters(
    filtros: FiltrosAcreditacion = {},
    include: Prisma.AcreditacionInclude = { aeropuerto: true }
  ): Promise<AcreditacionWithRelations[]> {
    const where: Prisma.AcreditacionWhereInput = {}

    // Aplicar filtros
    if (filtros.aeropuertoId) {
      where.aeropuertoId = filtros.aeropuertoId
    }

    if (filtros.estado) {
      where.estado = filtros.estado
    }

    if (filtros.hasWarning !== undefined) {
      where.hasWarning = filtros.hasWarning
    }

    if (filtros.fechaIngresoDesde || filtros.fechaIngresoHasta) {
      where.fechaIngreso = {}
      if (filtros.fechaIngresoDesde) {
        where.fechaIngreso.gte = filtros.fechaIngresoDesde
      }
      if (filtros.fechaIngresoHasta) {
        where.fechaIngreso.lte = filtros.fechaIngresoHasta
      }
    }

    if (filtros.fechaVencimientoDesde || filtros.fechaVencimientoHasta) {
      where.fechaVencimiento = {}
      if (filtros.fechaVencimientoDesde) {
        where.fechaVencimiento.gte = filtros.fechaVencimientoDesde
      }
      if (filtros.fechaVencimientoHasta) {
        where.fechaVencimiento.lte = filtros.fechaVencimientoHasta
      }
    }

    if (filtros.solicitante) {
      where.solicitante = {
        contains: filtros.solicitante,
        mode: 'insensitive'
      }
    }

    if (filtros.personal) {
      where.personal = {
        contains: filtros.personal,
        mode: 'insensitive'
      }
    }

    return this.model.findMany({
      where,
      include,
      orderBy: { fechaIngreso: 'desc' }
    })
  }

  // Buscar por aeropuerto
  async findByAeropuerto(aeropuertoId: string): Promise<Acreditacion[]> {
    return this.model.findMany({
      where: { aeropuertoId },
      include: { aeropuerto: true },
      orderBy: { fechaIngreso: 'desc' }
    })
  }

  // Buscar acreditaciones vencidas
  async findVencidas(): Promise<Acreditacion[]> {
    return this.model.findMany({
      where: {
        fechaVencimiento: {
          lt: new Date()
        },
        estado: {
          notIn: [EstadoAcreditacion.APROBADO, EstadoAcreditacion.VENCIDO, EstadoAcreditacion.CANCELADO]
        }
      },
      include: { aeropuerto: true },
      orderBy: { fechaVencimiento: 'asc' }
    })
  }

  // Buscar acreditaciones en tiempo
  async findEnTiempo(): Promise<Acreditacion[]> {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + 7) // Próximos 7 días

    return this.model.findMany({
      where: {
        fechaVencimiento: {
          gte: new Date(),
          lte: fechaLimite
        },
        estado: {
          in: [EstadoAcreditacion.PENDIENTE, EstadoAcreditacion.EN_PROCESO, EstadoAcreditacion.EN_REVISION]
        }
      },
      include: { aeropuerto: true },
      orderBy: { fechaVencimiento: 'asc' }
    })
  }

  // Buscar acreditaciones con discrepancias
  async findConDiscrepancias(): Promise<AcreditacionWithRelations[]> {
    return this.model.findMany({
      where: { hasWarning: true },
      include: {
        aeropuerto: true,
        documentos: true,
        actividades: true
      },
      orderBy: { fechaIngreso: 'desc' }
    })
  }

  // Buscar acreditaciones próximas a vencer
  async findProximasAVencer(dias: number = 7): Promise<AcreditacionWithRelations[]> {
    const fechaInicio = new Date()
    const fechaFin = new Date()
    fechaFin.setDate(fechaFin.getDate() + dias)

    return this.model.findMany({
      where: {
        fechaVencimiento: {
          gte: fechaInicio,
          lte: fechaFin
        },
        estado: {
          notIn: [EstadoAcreditacion.APROBADO, EstadoAcreditacion.VENCIDO, EstadoAcreditacion.CANCELADO]
        }
      },
      include: {
        aeropuerto: true,
        documentos: true,
        actividades: true
      },
      orderBy: { fechaVencimiento: 'asc' }
    })
  }

  // Obtener estadísticas completas
  async getEstadisticas(): Promise<EstadisticasAcreditacion> {
    // Obtener conteos básicos
    const [total, concluidas, enTiempo, atrasadas, discrepancias] = await Promise.all([
      this.model.count(),
      this.model.count({ where: { estado: EstadoAcreditacion.APROBADO } }),
      this.model.count({
        where: {
          fechaVencimiento: { gte: new Date() },
          estado: {
            in: [EstadoAcreditacion.PENDIENTE, EstadoAcreditacion.EN_PROCESO, EstadoAcreditacion.EN_REVISION]
          }
        }
      }),
      this.model.count({
        where: {
          fechaVencimiento: { lt: new Date() },
          estado: {
            notIn: [EstadoAcreditacion.APROBADO, EstadoAcreditacion.VENCIDO, EstadoAcreditacion.CANCELADO]
          }
        }
      }),
      this.model.count({ where: { hasWarning: true } })
    ])

    // Obtener distribución por aeropuerto
    const porAeropuerto = await this.model.groupBy({
      by: ['aeropuertoId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // Obtener nombres de aeropuertos
    const aeropuertos = await this.prisma.aeropuerto.findMany({
      where: { id: { in: porAeropuerto.map((a: any) => a.aeropuertoId) } }
    })

    const aeropuertoMap = new Map(aeropuertos.map((a: any) => [a.id, a.nombre]))

    const estadisticasAeropuerto = porAeropuerto.map((stat: any) => ({
      aeropuertoId: stat.aeropuertoId,
      aeropuertoNombre: aeropuertoMap.get(stat.aeropuertoId) || stat.aeropuertoId,
      cantidad: stat._count.id,
      porcentaje: total > 0 ? Math.round((stat._count.id / total) * 100) : 0
    }))

    // Obtener distribución por estado
    const porEstado = await this.model.groupBy({
      by: ['estado'],
      _count: { id: true }
    })

    const estadisticasEstado = porEstado.map((stat: any) => ({
      estado: stat.estado,
      cantidad: stat._count.id,
      porcentaje: total > 0 ? Math.round((stat._count.id / total) * 100) : 0
    }))

    // Calcular tiempo promedio de proceso (acreditaciones completadas)
    const acreditacionesCompletadas = await this.model.findMany({
      where: { estado: EstadoAcreditacion.APROBADO },
      select: { fechaIngreso: true, updatedAt: true }
    })

    let tiempoPromedioProcesso = 0
    if (acreditacionesCompletadas.length > 0) {
      const tiempoTotal = acreditacionesCompletadas.reduce((total: number, acred: any) => {
        const diasProceso = Math.floor((acred.updatedAt.getTime() - acred.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
        return total + diasProceso
      }, 0)
      tiempoPromedioProcesso = Math.round(tiempoTotal / acreditacionesCompletadas.length)
    }

    return {
      total,
      concluidas,
      enTiempo,
      atrasadas,
      discrepancias,
      porAeropuerto: estadisticasAeropuerto,
      porEstado: estadisticasEstado,
      tiempoPromedioProcesso
    }
  }

  // Buscar con paginación
  async findPaginated(
    page: number = 1,
    limit: number = 10,
    filtros: FiltrosAcreditacion = {}
  ): Promise<{
    data: AcreditacionWithRelations[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const where: Prisma.AcreditacionWhereInput = {}
    // Aplicar filtros (misma lógica que findWithFilters)
    // ... (código de filtros)

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        include: { aeropuerto: true, documentos: true, actividades: true },
        skip,
        take: limit,
        orderBy: { fechaIngreso: 'desc' }
      }),
      this.model.count({ where })
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Actualizar progreso
  async updateProgreso(id: string, progreso: number): Promise<Acreditacion> {
    return this.model.update({
      where: { id },
      data: {
        progreso,
        updatedAt: new Date()
      }
    })
  }

  // Marcar como completada
  async marcarComoCompletada(id: string): Promise<Acreditacion> {
    return this.model.update({
      where: { id },
      data: {
        estado: EstadoAcreditacion.APROBADO,
        progreso: 100,
        updatedAt: new Date()
      }
    })
  }

  // Marcar con discrepancia
  async marcarConDiscrepancia(id: string, observaciones?: string): Promise<Acreditacion> {
    return this.model.update({
      where: { id },
      data: {
        hasWarning: true,
        estado: EstadoAcreditacion.EN_REVISION,
        observaciones,
        updatedAt: new Date()
      }
    })
  }
}