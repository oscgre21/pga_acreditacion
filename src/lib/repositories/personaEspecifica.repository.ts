import { PrismaClient } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface PersonaEspecificaEntity extends BaseEntity {
  nombre: string;
  apellido: string;
  cedula: string;
  companiaId?: string;
  funcion: string;
  telefono?: string;
  correo?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  compania?: {
    id: string;
    nombre: string;
    abreviatura: string;
  };
}

export class PersonaEspecificaRepository extends BaseRepository<PersonaEspecificaEntity> {
  protected modelName = 'personaEspecifica';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(includeInactive = false): Promise<PersonaEspecificaEntity[]> {
    const where = includeInactive ? {} : { estado: 'ACTIVO' as const };

    return await this.prisma.personaEspecifica.findMany({
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
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    }) as PersonaEspecificaEntity[];
  }

  async findById(id: string): Promise<PersonaEspecificaEntity | null> {
    return await this.prisma.personaEspecifica.findUnique({
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
    }) as PersonaEspecificaEntity | null;
  }

  async findByCedula(cedula: string): Promise<PersonaEspecificaEntity | null> {
    return await this.prisma.personaEspecifica.findUnique({
      where: { cedula },
      include: {
        compania: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true
          }
        }
      }
    }) as PersonaEspecificaEntity | null;
  }

  async findByCompania(companiaId: string): Promise<PersonaEspecificaEntity[]> {
    return await this.prisma.personaEspecifica.findMany({
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
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    }) as PersonaEspecificaEntity[];
  }

  async findByFuncion(funcion: string): Promise<PersonaEspecificaEntity[]> {
    return await this.prisma.personaEspecifica.findMany({
      where: {
        funcion: {
          contains: funcion,
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
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    }) as PersonaEspecificaEntity[];
  }

  async searchByName(query: string): Promise<PersonaEspecificaEntity[]> {
    return await this.prisma.personaEspecifica.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            apellido: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            cedula: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
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
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' }
      ]
    }) as PersonaEspecificaEntity[];
  }

  async getActiveCount(): Promise<number> {
    return await this.prisma.personaEspecifica.count({
      where: { estado: 'ACTIVO' }
    });
  }

  async getCountByCompania(companiaId: string): Promise<number> {
    return await this.prisma.personaEspecifica.count({
      where: {
        companiaId,
        estado: 'ACTIVO'
      }
    });
  }
}