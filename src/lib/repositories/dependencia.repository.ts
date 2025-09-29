import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface DependenciaEntity extends BaseEntity {
  nombre: string;
}

export class DependenciaRepository extends BaseRepository<DependenciaEntity> {
  protected modelName = 'dependencia';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<DependenciaEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async findWithValidadores(id: string) {
    return await this.model.findUnique({
      where: { id },
      include: {
        validadores: {
          where: { estado: 'ACTIVO' }
        },
        ejecutores: {
          where: { estado: 'ACTIVO' }
        }
      }
    });
  }

  async getStatsById(id: string) {
    const dependencia = await this.model.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            validadores: {
              where: { estado: 'ACTIVO' }
            },
            ejecutores: {
              where: { estado: 'ACTIVO' }
            }
          }
        }
      }
    });

    return {
      ...dependencia,
      totalValidadores: dependencia?._count?.validadores || 0,
      totalEjecutores: dependencia?._count?.ejecutores || 0
    };
  }

  async searchByName(query: string): Promise<DependenciaEntity[]> {
    return await this.model.findMany({
      where: {
        nombre: { contains: query, mode: 'insensitive' },
        estado: 'ACTIVO'
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }
}