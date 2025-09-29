import { prisma } from '@/lib/prisma';
import { EjecutorRepository, EjecutorEntity } from '../repositories/ejecutor.repository';

const ejecutorRepository = new EjecutorRepository(prisma);

export class EjecutorService {
  async getAllEjecutores(includeInactive = false): Promise<EjecutorEntity[]> {
    return await ejecutorRepository.getAllWithDependencia(includeInactive);
  }

  async getEjecutorById(id: string): Promise<EjecutorEntity | null> {
    return await ejecutorRepository.findWithDependencia(id);
  }

  async createEjecutor(data: Omit<EjecutorEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<EjecutorEntity> {
    return await ejecutorRepository.create(data);
  }

  async updateEjecutor(id: string, data: Partial<Omit<EjecutorEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EjecutorEntity> {
    const existing = await ejecutorRepository.findById(id);
    if (!existing) {
      throw new Error('Ejecutor no encontrado');
    }

    return await ejecutorRepository.update(id, data);
  }

  async deleteEjecutor(id: string): Promise<EjecutorEntity> {
    const existing = await ejecutorRepository.findById(id);
    if (!existing) {
      throw new Error('Ejecutor no encontrado');
    }

    return await ejecutorRepository.softDelete(id);
  }

  async getEjecutoresByDependencia(dependenciaId: string): Promise<EjecutorEntity[]> {
    return await ejecutorRepository.findByDependencia(dependenciaId);
  }

  async getEjecutoresBySede(sede: string): Promise<EjecutorEntity[]> {
    return await ejecutorRepository.findBySede(sede);
  }

  async getEjecutoresByRango(rango: string): Promise<EjecutorEntity[]> {
    return await ejecutorRepository.getByRango(rango);
  }

  async searchEjecutores(query: string): Promise<EjecutorEntity[]> {
    return await ejecutorRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await ejecutorRepository.getActiveCount();
  }

  async getCountByDependencia(dependenciaId: string): Promise<number> {
    return await ejecutorRepository.getCountByDependencia(dependenciaId);
  }

  async paginateEjecutores(page = 1, limit = 10, includeInactive = false) {
    return await ejecutorRepository.paginate(page, limit, includeInactive);
  }
}

export const ejecutorService = new EjecutorService();