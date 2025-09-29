import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface CategoriaEntity extends BaseEntity {
  nombre: string;
}

export class CategoriaRepository extends BaseRepository<CategoriaEntity> {
  protected modelName = 'categoria';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<CategoriaEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async searchByName(query: string, includeInactive = false): Promise<CategoriaEntity[]> {
    const where = includeInactive
      ? { nombre: { contains: query, mode: 'insensitive' } }
      : { nombre: { contains: query, mode: 'insensitive' }, estado: 'ACTIVO' };

    return await this.model.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }
}