import { PrismaClient, Compania } from '@prisma/client';
import { BaseRepository, BaseEntity } from './base.repository';

export interface CompaniaEntity extends BaseEntity {
  abreviatura: string;
  nombre: string;
  rnc: string;
  representante: string;
  telefono: string;
  isWhatsapp: boolean;
  whatsapp?: string | null;
  correo: string;
  direccion: string;
  logo?: string | null;
  notas?: string | null;
}

export class CompaniaRepository extends BaseRepository<CompaniaEntity> {
  protected modelName = 'compania';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByRnc(rnc: string): Promise<CompaniaEntity | null> {
    return this.findOneByField('rnc', rnc);
  }

  async findByAbreviatura(abreviatura: string): Promise<CompaniaEntity | null> {
    return this.findOneByField('abreviatura', abreviatura);
  }

  async findByCorreo(correo: string): Promise<CompaniaEntity | null> {
    return this.findOneByField('correo', correo);
  }

  async searchByName(query: string): Promise<CompaniaEntity[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { abreviatura: { contains: query, mode: 'insensitive' } }
        ],
        estado: 'ACTIVO'
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async findWithPerfiles(id: string) {
    return await this.model.findUnique({
      where: { id },
      include: {
        perfilesEmpresa: {
          where: { estado: 'ACTIVO' }
        },
        personal: {
          where: { estado: 'ACTIVO' }
        }
      }
    });
  }

  async getActiveCount(): Promise<number> {
    return this.count(false);
  }
}