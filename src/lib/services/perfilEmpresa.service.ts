import { PrismaClient } from '@prisma/client';
import { PerfilEmpresaRepository, PerfilEmpresaEntity } from '../repositories/perfilEmpresa.repository';

const prisma = new PrismaClient();
const perfilEmpresaRepository = new PerfilEmpresaRepository(prisma);

export class PerfilEmpresaService {
  async getAllPerfilesEmpresa(includeInactive = false): Promise<PerfilEmpresaEntity[]> {
    return await perfilEmpresaRepository.findAll(includeInactive);
  }

  async getPerfilEmpresaById(id: string): Promise<PerfilEmpresaEntity | null> {
    return await perfilEmpresaRepository.findById(id);
  }

  async createPerfilEmpresa(data: Omit<PerfilEmpresaEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PerfilEmpresaEntity> {
    return await perfilEmpresaRepository.create(data);
  }

  async updatePerfilEmpresa(id: string, data: Partial<Omit<PerfilEmpresaEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PerfilEmpresaEntity> {
    const existing = await perfilEmpresaRepository.findById(id);
    if (!existing) {
      throw new Error('Perfil de empresa no encontrado');
    }

    return await perfilEmpresaRepository.update(id, data);
  }

  async deletePerfilEmpresa(id: string): Promise<PerfilEmpresaEntity> {
    const existing = await perfilEmpresaRepository.findById(id);
    if (!existing) {
      throw new Error('Perfil de empresa no encontrado');
    }

    return await perfilEmpresaRepository.softDelete(id);
  }

  async getPerfilesEmpresaByCompania(companiaId: string): Promise<PerfilEmpresaEntity[]> {
    return await perfilEmpresaRepository.findByCompania(companiaId);
  }

  async getPerfilesEmpresaByTipo(tipo: string): Promise<PerfilEmpresaEntity[]> {
    return await perfilEmpresaRepository.findByTipo(tipo);
  }

  async searchPerfilesEmpresa(query: string): Promise<PerfilEmpresaEntity[]> {
    return await perfilEmpresaRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await perfilEmpresaRepository.getActiveCount();
  }

  async getCountByCompania(companiaId: string): Promise<number> {
    return await perfilEmpresaRepository.getCountByCompania(companiaId);
  }

  async paginatePerfilesEmpresa(page = 1, limit = 10, includeInactive = false) {
    return await perfilEmpresaRepository.paginate(page, limit, includeInactive);
  }
}

export const perfilEmpresaService = new PerfilEmpresaService();