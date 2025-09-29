import { prisma } from '@/lib/prisma';
import { ServicioSeguridad } from '@prisma/client';

export class ServicioSeguridadService {
  async getAllServiciosSeguridad(includeInactive = false) {
    const where = includeInactive ? {} : { activo: true };

    return await prisma.servicioSeguridad.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }

  async getServicioSeguridadById(id: string) {
    return await prisma.servicioSeguridad.findUnique({
      where: { id }
    });
  }

  async createServicioSeguridad(data: Omit<ServicioSeguridad, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.servicioSeguridad.create({
      data
    });
  }

  async updateServicioSeguridad(id: string, data: Partial<Omit<ServicioSeguridad, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.servicioSeguridad.update({
      where: { id },
      data
    });
  }

  async deleteServicioSeguridad(id: string) {
    return await prisma.servicioSeguridad.update({
      where: { id },
      data: { activo: false }
    });
  }

  async searchServiciosSeguridad(query: string, includeInactive = false) {
    const where = {
      AND: [
        includeInactive ? {} : { activo: true },
        {
          OR: [
            { nombre: { contains: query, mode: 'insensitive' as const } },
            { codigo: { contains: query, mode: 'insensitive' as const } },
            { descripcion: { contains: query, mode: 'insensitive' as const } }
          ]
        }
      ]
    };

    return await prisma.servicioSeguridad.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });
  }
}

export const servicioSeguridadService = new ServicioSeguridadService();