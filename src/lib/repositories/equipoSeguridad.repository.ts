import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface EquipoSeguridadEntity extends BaseEntity {
  nombre: string;
  descripcion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export class EquipoSeguridadRepository extends BaseRepository<EquipoSeguridadEntity> {
  protected modelName = 'equipoSeguridad';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<EquipoSeguridadEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async searchByName(query: string): Promise<EquipoSeguridadEntity[]> {
    return await this.model.findMany({
      where: {
        nombre: {
          contains: query,
          mode: 'insensitive'
        },
        estado: 'ACTIVO'
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }
}