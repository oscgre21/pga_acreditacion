import { prisma } from '@/lib/prisma';
import { ValidadorRepository, ValidadorEntity } from '../repositories/validador.repository';

const validadorRepository = new ValidadorRepository(prisma);

export class ValidadorService {
  async getAllValidadores(includeInactive = false): Promise<ValidadorEntity[]> {
    return await validadorRepository.getAllWithDependencia(includeInactive);
  }

  async getValidadorById(id: string): Promise<ValidadorEntity | null> {
    return await validadorRepository.findWithDependencia(id);
  }

  async createValidador(data: Omit<ValidadorEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ValidadorEntity> {
    return await validadorRepository.create(data);
  }

  async updateValidador(id: string, data: Partial<Omit<ValidadorEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ValidadorEntity> {
    const existing = await validadorRepository.findById(id);
    if (!existing) {
      throw new Error('Validador no encontrado');
    }

    return await validadorRepository.update(id, data);
  }

  async deleteValidador(id: string): Promise<ValidadorEntity> {
    const existing = await validadorRepository.findById(id);
    if (!existing) {
      throw new Error('Validador no encontrado');
    }

    return await validadorRepository.softDelete(id);
  }

  async getValidadoresByDependencia(dependenciaId: string): Promise<ValidadorEntity[]> {
    return await validadorRepository.findByDependencia(dependenciaId);
  }

  async getValidadoresBySede(sede: string): Promise<ValidadorEntity[]> {
    return await validadorRepository.findBySede(sede);
  }

  async getValidadoresByRango(rango: string): Promise<ValidadorEntity[]> {
    return await validadorRepository.getByRango(rango);
  }

  async searchValidadores(query: string): Promise<ValidadorEntity[]> {
    return await validadorRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await validadorRepository.getActiveCount();
  }

  async getCountByDependencia(dependenciaId: string): Promise<number> {
    return await validadorRepository.getCountByDependencia(dependenciaId);
  }

  async paginateValidadores(page = 1, limit = 10, includeInactive = false) {
    return await validadorRepository.paginate(page, limit, includeInactive);
  }
}

export const validadorService = new ValidadorService();