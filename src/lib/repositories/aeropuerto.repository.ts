// src/lib/repositories/aeropuerto.repository.ts
import { Aeropuerto, Prisma, PrismaClient } from '@prisma/client'

export interface AeropuertoEntity {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AeropuertoWithStats = Prisma.AeropuertoGetPayload<{
  include: {
    acreditaciones: {
      select: {
        id: true
        estado: true
        hasWarning: true
      }
    }
  }
}>

export type CreateAeropuertoData = Prisma.AeropuertoCreateInput
export type UpdateAeropuertoData = Prisma.AeropuertoUpdateInput

export interface EstadisticasAeropuerto {
  id: string
  codigo: string
  nombre: string
  totalAcreditaciones: number
  acreditacionesCompletadas: number
  acreditacionesEnProceso: number
  acreditacionesConDiscrepancias: number
  porcentajeCompletadas: number
}

export class AeropuertoRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected get model() {
    return this.prisma.aeropuerto;
  }

  // Basic CRUD methods
  async findAll(includeInactive = false): Promise<AeropuertoEntity[]> {
    const where = includeInactive ? {} : { activo: true };
    return await this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<AeropuertoEntity | null> {
    return await this.model.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<AeropuertoEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AeropuertoEntity> {
    return await this.model.create({
      data: {
        ...data,
        id: data.codigo, // Use codigo as id for now
      }
    });
  }

  async update(id: string, data: Partial<Omit<AeropuertoEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AeropuertoEntity> {
    return await this.model.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<AeropuertoEntity> {
    return await this.model.update({
      where: { id },
      data: { activo: false }
    });
  }

  async count(includeInactive = false): Promise<number> {
    const where = includeInactive ? {} : { activo: true };
    return this.model.count({ where });
  }

  // Buscar aeropuertos activos
  async findActivos(): Promise<AeropuertoEntity[]> {
    return this.model.findMany({
      where: { activo: true },
      orderBy: { codigo: 'asc' }
    })
  }

  // Buscar aeropuerto por código
  async findByCodigo(codigo: string): Promise<AeropuertoEntity | null> {
    return this.model.findUnique({
      where: { codigo: codigo.toUpperCase() }
    })
  }

  // Buscar aeropuertos por nombre (similar a categorías)
  async searchByName(query: string, includeInactive = false): Promise<AeropuertoEntity[]> {
    const where = includeInactive
      ? {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' } },
            { codigo: { contains: query, mode: 'insensitive' } }
          ]
        }
      : {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' } },
            { codigo: { contains: query, mode: 'insensitive' } }
          ],
          activo: true
        };

    return await this.model.findMany({
      where,
      orderBy: { codigo: 'asc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }

  // Obtener aeropuertos con estadísticas de acreditaciones
  async findWithStats(): Promise<EstadisticasAeropuerto[]> {
    const aeropuertosConStats = await this.model.findMany({
      where: { activo: true },
      include: {
        acreditaciones: {
          select: {
            id: true,
            estado: true,
            hasWarning: true
          }
        }
      },
      orderBy: { codigo: 'asc' }
    })

    return aeropuertosConStats.map((aeropuerto: any) => {
      const total = aeropuerto.acreditaciones.length
      const completadas = aeropuerto.acreditaciones.filter((a: any) => a.estado === 'APROBADO').length
      const enProceso = aeropuerto.acreditaciones.filter((a: any) =>
        ['PENDIENTE', 'EN_PROCESO', 'EN_REVISION'].includes(a.estado)
      ).length
      const conDiscrepancias = aeropuerto.acreditaciones.filter((a: any) => a.hasWarning).length

      return {
        id: aeropuerto.id,
        codigo: aeropuerto.codigo,
        nombre: aeropuerto.nombre,
        totalAcreditaciones: total,
        acreditacionesCompletadas: completadas,
        acreditacionesEnProceso: enProceso,
        acreditacionesConDiscrepancias: conDiscrepancias,
        porcentajeCompletadas: total > 0 ? Math.round((completadas / total) * 100) : 0
      }
    })
  }

  // Obtener distribución de acreditaciones por aeropuerto para gráficos
  async getDistribucionAcreditaciones(): Promise<Array<{
    aeropuerto: string
    codigo: string
    cantidad: number
    porcentaje: number
  }>> {
    const distribucion = await this.prisma.$queryRaw<Array<{
      aeropuerto_id: string
      aeropuerto_codigo: string
      aeropuerto_nombre: string
      cantidad: bigint
    }>>`
      SELECT
        a.id as aeropuerto_id,
        a.codigo as aeropuerto_codigo,
        a.nombre as aeropuerto_nombre,
        COUNT(ac.id) as cantidad
      FROM aeropuertos a
      LEFT JOIN acreditaciones ac ON a.id = ac."aeropuertoId"
      WHERE a.activo = true
      GROUP BY a.id, a.codigo, a.nombre
      ORDER BY cantidad DESC
    `

    const total = distribucion.reduce((sum: number, item: any) => sum + Number(item.cantidad), 0)

    return distribucion.map((item: any) => ({
      aeropuerto: item.aeropuerto_nombre,
      codigo: item.aeropuerto_codigo,
      cantidad: Number(item.cantidad),
      porcentaje: total > 0 ? Math.round((Number(item.cantidad) / total) * 100) : 0
    }))
  }

  // Buscar aeropuertos con más actividad reciente
  async findMasActivos(limite: number = 5): Promise<EstadisticasAeropuerto[]> {
    const stats = await this.findWithStats()
    return stats
      .sort((a, b) => b.totalAcreditaciones - a.totalAcreditaciones)
      .slice(0, limite)
  }
}