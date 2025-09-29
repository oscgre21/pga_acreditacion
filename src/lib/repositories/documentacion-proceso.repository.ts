import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface DocumentacionProcesoEntity extends BaseEntity {
  nombre: string;
  descripcion?: string;
  proceso: string;
  categoria: string;
  version: string;
  archivo?: string;
  obligatorio: boolean;
}

export class DocumentacionProcesoRepository extends BaseRepository<DocumentacionProcesoEntity> {
  protected modelName = 'documentacionProceso';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<DocumentacionProcesoEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async findByProceso(proceso: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    const where = includeInactive
      ? { proceso }
      : { proceso, estado: 'ACTIVO' };

    return await this.model.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async findByCategoria(categoria: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    const where = includeInactive
      ? { categoria }
      : { categoria, estado: 'ACTIVO' };

    return await this.model.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async searchByName(query: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    const where = includeInactive
      ? {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' } },
            { descripcion: { contains: query, mode: 'insensitive' } },
            { proceso: { contains: query, mode: 'insensitive' } },
            { categoria: { contains: query, mode: 'insensitive' } }
          ]
        }
      : {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' } },
            { descripcion: { contains: query, mode: 'insensitive' } },
            { proceso: { contains: query, mode: 'insensitive' } },
            { categoria: { contains: query, mode: 'insensitive' } }
          ],
          estado: 'ACTIVO'
        };

    return await this.model.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }

  async getObligatoriosCount(): Promise<number> {
    return await this.model.count({
      where: {
        obligatorio: true,
        estado: 'ACTIVO'
      }
    });
  }
}