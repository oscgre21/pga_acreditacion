import { prisma } from '@/lib/prisma';
import { EquipoSeguridadRepository, EquipoSeguridadEntity } from '../repositories/equipoSeguridad.repository';

const equipoSeguridadRepository = new EquipoSeguridadRepository(prisma);

export class EquipoSeguridadService {
  async getAllEquiposSeguridad(includeInactive = false): Promise<EquipoSeguridadEntity[]> {
    return await equipoSeguridadRepository.findAll(includeInactive);
  }

  async getEquipoSeguridadById(id: string): Promise<EquipoSeguridadEntity | null> {
    return await equipoSeguridadRepository.findById(id);
  }

  async createEquipoSeguridad(data: Omit<EquipoSeguridadEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<EquipoSeguridadEntity> {
    // Validar que no exista un equipo de seguridad con el mismo nombre
    if (await equipoSeguridadRepository.findByNombre(data.nombre)) {
      throw new Error('Ya existe un servicio de seguridad con este nombre');
    }

    return await equipoSeguridadRepository.create(data);
  }

  async updateEquipoSeguridad(id: string, data: Partial<Omit<EquipoSeguridadEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EquipoSeguridadEntity> {
    const existing = await equipoSeguridadRepository.findById(id);
    if (!existing) {
      throw new Error('Servicio de seguridad no encontrado');
    }

    // Validar nombre único si se está actualizando
    if (data.nombre && data.nombre !== existing.nombre) {
      const existingNombre = await equipoSeguridadRepository.findByNombre(data.nombre);
      if (existingNombre && existingNombre.id !== id) {
        throw new Error('Ya existe un servicio de seguridad con este nombre');
      }
    }

    return await equipoSeguridadRepository.update(id, data);
  }

  async deleteEquipoSeguridad(id: string): Promise<EquipoSeguridadEntity> {
    const existing = await equipoSeguridadRepository.findById(id);
    if (!existing) {
      throw new Error('Servicio de seguridad no encontrado');
    }

    return await equipoSeguridadRepository.softDelete(id);
  }

  async searchEquiposSeguridad(query: string): Promise<EquipoSeguridadEntity[]> {
    return await equipoSeguridadRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await equipoSeguridadRepository.getActiveCount();
  }

  async paginateEquiposSeguridad(page = 1, limit = 10, includeInactive = false) {
    return await equipoSeguridadRepository.paginate(page, limit, includeInactive);
  }
}

export const equipoSeguridadService = new EquipoSeguridadService();