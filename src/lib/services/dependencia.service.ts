import { prisma } from '@/lib/prisma';
import { DependenciaRepository, DependenciaEntity } from '../repositories/dependencia.repository';

const dependenciaRepository = new DependenciaRepository(prisma);

export class DependenciaService {
  async getAllDependencias(includeInactive = false): Promise<DependenciaEntity[]> {
    return await dependenciaRepository.findAll(includeInactive);
  }

  async getDependenciaById(id: string): Promise<DependenciaEntity | null> {
    return await dependenciaRepository.findById(id);
  }

  async getDependenciaWithStats(id: string) {
    return await dependenciaRepository.getStatsById(id);
  }

  async createDependencia(data: Omit<DependenciaEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DependenciaEntity> {
    // Validar que no exista una dependencia con el mismo nombre
    if (await dependenciaRepository.findByNombre(data.nombre)) {
      throw new Error('Ya existe una dependencia con este nombre');
    }

    return await dependenciaRepository.create(data);
  }

  async updateDependencia(id: string, data: Partial<Omit<DependenciaEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DependenciaEntity> {
    const existing = await dependenciaRepository.findById(id);
    if (!existing) {
      throw new Error('Dependencia no encontrada');
    }

    // Validar nombre único si se está actualizando
    if (data.nombre && data.nombre !== existing.nombre) {
      const existingNombre = await dependenciaRepository.findByNombre(data.nombre);
      if (existingNombre && existingNombre.id !== id) {
        throw new Error('Ya existe una dependencia con este nombre');
      }
    }

    return await dependenciaRepository.update(id, data);
  }

  async deleteDependencia(id: string): Promise<DependenciaEntity> {
    const existing = await dependenciaRepository.findById(id);
    if (!existing) {
      throw new Error('Dependencia no encontrada');
    }

    return await dependenciaRepository.softDelete(id);
  }

  async searchDependencias(query: string): Promise<DependenciaEntity[]> {
    return await dependenciaRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await dependenciaRepository.getActiveCount();
  }

  async paginateDependencias(page = 1, limit = 10, includeInactive = false) {
    return await dependenciaRepository.paginate(page, limit, includeInactive);
  }
}

export const dependenciaService = new DependenciaService();