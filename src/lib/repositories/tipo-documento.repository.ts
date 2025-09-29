import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface TipoDocumentoEntity extends BaseEntity {
  nombre: string;
  descripcion?: string | null;
  obligatorio: boolean;
}

export class TipoDocumentoRepository extends BaseRepository<TipoDocumentoEntity> {
  protected modelName = 'tipoDocumento';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByNombre(nombre: string): Promise<TipoDocumentoEntity | null> {
    return this.findOneByField('nombre', nombre);
  }

  async findObligatorios(): Promise<TipoDocumentoEntity[]> {
    return this.findByField('obligatorio', true);
  }

  async findOpcionales(): Promise<TipoDocumentoEntity[]> {
    return this.findByField('obligatorio', false);
  }

  async searchByName(query: string): Promise<TipoDocumentoEntity[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } }
        ],
        estado: 'ACTIVO'
      },
      orderBy: [
        { obligatorio: 'desc' },
        { nombre: 'asc' }
      ]
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