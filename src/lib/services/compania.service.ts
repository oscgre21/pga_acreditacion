import { prisma } from '@/lib/prisma';
import { CompaniaRepository, CompaniaEntity } from '../repositories/compania.repository';

const companiaRepository = new CompaniaRepository(prisma);

export class CompaniaService {
  async getAllCompanias(includeInactive = false): Promise<CompaniaEntity[]> {
    return await companiaRepository.findAll(includeInactive);
  }

  async getCompaniaById(id: string): Promise<CompaniaEntity | null> {
    return await companiaRepository.findById(id);
  }

  async getCompaniaWithDetails(id: string) {
    return await companiaRepository.findWithPerfiles(id);
  }

  async createCompania(data: Omit<CompaniaEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompaniaEntity> {
    // Validaciones
    if (await companiaRepository.findByRnc(data.rnc)) {
      throw new Error('Ya existe una compañía con este RNC');
    }

    if (await companiaRepository.findByCorreo(data.correo)) {
      throw new Error('Ya existe una compañía con este correo electrónico');
    }

    if (await companiaRepository.findByAbreviatura(data.abreviatura)) {
      throw new Error('Ya existe una compañía con esta abreviatura');
    }

    return await companiaRepository.create(data);
  }

  async updateCompania(id: string, data: Partial<Omit<CompaniaEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CompaniaEntity> {
    const existing = await companiaRepository.findById(id);
    if (!existing) {
      throw new Error('Compañía no encontrada');
    }

    // Validar campos únicos si se están actualizando
    if (data.rnc && data.rnc !== existing.rnc) {
      const existingRnc = await companiaRepository.findByRnc(data.rnc);
      if (existingRnc && existingRnc.id !== id) {
        throw new Error('Ya existe una compañía con este RNC');
      }
    }

    if (data.correo && data.correo !== existing.correo) {
      const existingEmail = await companiaRepository.findByCorreo(data.correo);
      if (existingEmail && existingEmail.id !== id) {
        throw new Error('Ya existe una compañía con este correo electrónico');
      }
    }

    if (data.abreviatura && data.abreviatura !== existing.abreviatura) {
      const existingAbrev = await companiaRepository.findByAbreviatura(data.abreviatura);
      if (existingAbrev && existingAbrev.id !== id) {
        throw new Error('Ya existe una compañía con esta abreviatura');
      }
    }

    return await companiaRepository.update(id, data);
  }

  async deleteCompania(id: string): Promise<CompaniaEntity> {
    const existing = await companiaRepository.findById(id);
    if (!existing) {
      throw new Error('Compañía no encontrada');
    }

    return await companiaRepository.softDelete(id);
  }

  async searchCompanias(query: string): Promise<CompaniaEntity[]> {
    return await companiaRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await companiaRepository.getActiveCount();
  }

  async paginateCompanias(page = 1, limit = 10, includeInactive = false) {
    return await companiaRepository.paginate(page, limit, includeInactive);
  }
}

export const companiaService = new CompaniaService();