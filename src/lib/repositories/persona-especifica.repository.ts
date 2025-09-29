import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface PersonaEspecificaEntity extends BaseEntity {
  nombre: string;
  apellido: string;
  cedula: string;
  companiaId?: string | null;
  funcion: string;
  telefono?: string | null;
  correo?: string | null;
}

export class PersonaEspecificaRepository extends BaseRepository<PersonaEspecificaEntity> {
  protected modelName = 'personaEspecifica';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByCedula(cedula: string): Promise<PersonaEspecificaEntity | null> {
    return this.findOneByField('cedula', cedula);
  }

  async findByCompania(companiaId: string): Promise<PersonaEspecificaEntity[]> {
    return this.findByField('companiaId', companiaId);
  }

  async findByFuncion(funcion: string): Promise<PersonaEspecificaEntity[]> {
    return this.findByField('funcion', funcion);
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
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    });
  }

  async searchByName(query: string): Promise<PersonaEspecificaEntity[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { apellido: { contains: query, mode: 'insensitive' } },
          { cedula: { contains: query, mode: 'insensitive' } },
          { funcion: { contains: query, mode: 'insensitive' } }
        ],
        estado: 'ACTIVO'
      },
      include: {
        compania: true
      },
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
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

  async getCountByFuncion(funcion: string): Promise<number> {
    return await this.model.count({
      where: {
        funcion,
        estado: 'ACTIVO'
      }
    });
  }
}