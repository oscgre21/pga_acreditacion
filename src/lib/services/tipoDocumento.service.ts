import { prisma } from '@/lib/prisma';
import { TipoDocumentoRepository, TipoDocumentoEntity } from '../repositories/tipoDocumento.repository';

const tipoDocumentoRepository = new TipoDocumentoRepository(prisma);

export class TipoDocumentoService {
  async getAllTiposDocumento(includeInactive = false): Promise<TipoDocumentoEntity[]> {
    return await tipoDocumentoRepository.findAll(includeInactive);
  }

  async getTipoDocumentoById(id: string): Promise<TipoDocumentoEntity | null> {
    return await tipoDocumentoRepository.findById(id);
  }

  async createTipoDocumento(data: Omit<TipoDocumentoEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TipoDocumentoEntity> {
    // Validar que no exista un tipo de documento con el mismo nombre
    if (await tipoDocumentoRepository.findByNombre(data.nombre)) {
      throw new Error('Ya existe un tipo de documento con este nombre');
    }

    return await tipoDocumentoRepository.create(data);
  }

  async updateTipoDocumento(id: string, data: Partial<Omit<TipoDocumentoEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TipoDocumentoEntity> {
    const existing = await tipoDocumentoRepository.findById(id);
    if (!existing) {
      throw new Error('Tipo de documento no encontrado');
    }

    // Validar nombre único si se está actualizando
    if (data.nombre && data.nombre !== existing.nombre) {
      const existingNombre = await tipoDocumentoRepository.findByNombre(data.nombre);
      if (existingNombre && existingNombre.id !== id) {
        throw new Error('Ya existe un tipo de documento con este nombre');
      }
    }

    return await tipoDocumentoRepository.update(id, data);
  }

  async deleteTipoDocumento(id: string): Promise<TipoDocumentoEntity> {
    const existing = await tipoDocumentoRepository.findById(id);
    if (!existing) {
      throw new Error('Tipo de documento no encontrado');
    }

    return await tipoDocumentoRepository.softDelete(id);
  }

  async searchTiposDocumento(query: string): Promise<TipoDocumentoEntity[]> {
    return await tipoDocumentoRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await tipoDocumentoRepository.getActiveCount();
  }

  async getTiposDocumentoObligatorios(): Promise<TipoDocumentoEntity[]> {
    return await tipoDocumentoRepository.getObligatorios();
  }

  async paginateTiposDocumento(page = 1, limit = 10, includeInactive = false) {
    return await tipoDocumentoRepository.paginate(page, limit, includeInactive);
  }
}

export const tipoDocumentoService = new TipoDocumentoService();