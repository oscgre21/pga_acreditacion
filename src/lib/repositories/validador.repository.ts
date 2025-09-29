import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface ValidadorEntity extends BaseEntity {
  nombre: string;
  apellido: string;
  rango: string;
  dependenciaId: string;
  sede: string;
  fechaAsignacion: Date;
  asignadoPor: string;
  foto?: string | null;
  dependencia?: {
    id: string;
    nombre: string;
  };
}

export class ValidadorRepository extends BaseRepository<ValidadorEntity> {
  protected modelName = 'validador';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByDependencia(dependenciaId: string): Promise<ValidadorEntity[]> {
    return this.findByField('dependenciaId', dependenciaId);
  }

  async findBySede(sede: string): Promise<ValidadorEntity[]> {
    return this.findByField('sede', sede);
  }

  async findWithDependencia(id: string) {
    return await this.model.findUnique({
      where: { id },
      include: {
        dependencia: true
      }
    });
  }

  async getAllWithDependencia(includeInactive = false) {
    const where = includeInactive ? {} : { estado: 'ACTIVO' };
    return await this.model.findMany({
      where,
      include: {
        dependencia: true
      },
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    });
  }

  async searchByName(query: string): Promise<ValidadorEntity[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { apellido: { contains: query, mode: 'insensitive' } },
          { rango: { contains: query, mode: 'insensitive' } }
        ],
        estado: 'ACTIVO'
      },
      include: {
        dependencia: true
      },
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    });
  }

  async getByRango(rango: string): Promise<ValidadorEntity[]> {
    return this.findByField('rango', rango);
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }

  async getCountByDependencia(dependenciaId: string): Promise<number> {
    return await this.model.count({
      where: {
        dependenciaId,
        estado: 'ACTIVO'
      }
    });
  }
}