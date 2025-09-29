import { prisma } from '@/lib/prisma';
import { TipoDocumento } from '@prisma/client';

export class TipoDocumentoService {
  async getAllTiposDocumento(includeInactive = false) {
    const where = includeInactive ? {} : { estado: 'ACTIVO' };

    return await prisma.tipoDocumento.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async getTipoDocumentoById(id: string) {
    return await prisma.tipoDocumento.findUnique({
      where: { id }
    });
  }

  async createTipoDocumento(data: Omit<TipoDocumento, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.tipoDocumento.create({
      data
    });
  }

  async updateTipoDocumento(id: string, data: Partial<Omit<TipoDocumento, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.tipoDocumento.update({
      where: { id },
      data
    });
  }

  async deleteTipoDocumento(id: string) {
    return await prisma.tipoDocumento.update({
      where: { id },
      data: { estado: 'INACTIVO' }
    });
  }

  async searchTiposDocumento(query: string, includeInactive = false) {
    const where = {
      AND: [
        includeInactive ? {} : { estado: 'ACTIVO' },
        {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' as const } },
            { descripcion: { contains: query, mode: 'insensitive' as const } }
          ]
        }
      ]
    };

    return await prisma.tipoDocumento.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }
}

export const tipoDocumentoService = new TipoDocumentoService();