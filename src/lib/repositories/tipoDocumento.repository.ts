import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface TipoDocumentoEntity extends BaseEntity {
  nombre: string;
  descripcion?: string;
  obligatorio: boolean;
  estado: 'ACTIVO' | 'INACTIVO';
}

export class TipoDocumentoRepository extends BaseRepository<TipoDocumentoEntity> {
  protected modelName = 'tipoDocumento';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<TipoDocumentoEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async searchByName(query: string): Promise<TipoDocumentoEntity[]> {
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

  async getObligatorios(): Promise<TipoDocumentoEntity[]> {
    return await this.model.findMany({
      where: {
        obligatorio: true,
        estado: 'ACTIVO'
      },
      orderBy: { nombre: 'asc' }
    });
  }
}