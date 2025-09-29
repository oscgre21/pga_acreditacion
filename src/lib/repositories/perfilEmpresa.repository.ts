import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface PerfilEmpresaEntity extends BaseEntity {
  companiaId: string;
  tipo: string;
  descripcion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  compania?: {
    id: string;
    nombre: string;
    abreviatura: string;
  };
}

export class PerfilEmpresaRepository extends BaseRepository<PerfilEmpresaEntity> {
  protected modelName = 'perfilEmpresa';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(includeInactive = false): Promise<PerfilEmpresaEntity[]> {
    const where = includeInactive ? {} : { estado: 'ACTIVO' as const };

    return await this.prisma.perfilEmpresa.findMany({
      where,
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      },
      orderBy: { tipo: 'asc' }
    }) as PerfilEmpresaEntity[];
  }

  async findById(id: string): Promise<PerfilEmpresaEntity | null> {
    return await this.prisma.perfilEmpresa.findUnique({
      where: { id },
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      }
    }) as PerfilEmpresaEntity | null;
  }

  async findByCompania(companiaId: string): Promise<PerfilEmpresaEntity[]> {
    return await this.prisma.perfilEmpresa.findMany({
      where: {
        companiaId,
        estado: 'ACTIVO'
      },
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      },
      orderBy: { tipo: 'asc' }
    }) as PerfilEmpresaEntity[];
  }

  async findByTipo(tipo: string): Promise<PerfilEmpresaEntity[]> {
    return await this.prisma.perfilEmpresa.findMany({
      where: {
        tipo: {
          contains: tipo,
          mode: 'insensitive'
        },
        estado: 'ACTIVO'
      },
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      },
      orderBy: { tipo: 'asc' }
    }) as PerfilEmpresaEntity[];
  }

  async searchByName(query: string): Promise<PerfilEmpresaEntity[]> {
    return await this.prisma.perfilEmpresa.findMany({
      where: {
        tipo: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      },
      orderBy: { tipo: 'asc' }
    }) as PerfilEmpresaEntity[];
  }

  async getActiveCount(): Promise<number> {
    return await this.prisma.perfilEmpresa.count({
      where: { estado: 'ACTIVO' }
    });
  }

  async getCountByCompania(companiaId: string): Promise<number> {
    return await this.prisma.perfilEmpresa.count({
      where: {
        companiaId,
        estado: 'ACTIVO'
      }
    });
  }
}