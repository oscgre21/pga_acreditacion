import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface PerfilEmpresaEntity extends BaseEntity {
  companiaId: string;
  tipo: string;
  descripcion?: string | null;
}

export class PerfilEmpresaRepository extends BaseRepository<PerfilEmpresaEntity> {
  protected modelName = 'perfilEmpresa';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByCompania(companiaId: string): Promise<PerfilEmpresaEntity[]> {
    return this.findByField('companiaId', companiaId);
  }

  async findByTipo(tipo: string): Promise<PerfilEmpresaEntity[]> {
    return this.findByField('tipo', tipo);
  }

  async findWithCompania(id: string) {
    return await this.model.findUnique({
      where: { id },
      include: {
        compania: true
      }
    });
  }

  async getAllWithCompania(includeInactive = false) {
    const where = includeInactive ? {} : { estado: 'ACTIVO' };
    return await this.model.findMany({
      where,
      include: {
        compania: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }

  async getCountByCompania(companiaId: string): Promise<number> {
    return await this.model.count({
      where: {
        companiaId,
        estado: 'ACTIVO'
      }
    });
  }
}