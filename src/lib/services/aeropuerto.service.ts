import { prisma } from '@/lib/prisma';
import { AeropuertoRepository, AeropuertoEntity } from '../repositories/aeropuerto.repository';

const aeropuertoRepository = new AeropuertoRepository(prisma);

export class AeropuertoService {
  async getAllAeropuertos(includeInactive = false): Promise<AeropuertoEntity[]> {
    return await aeropuertoRepository.findAll(includeInactive);
  }

  async getAeropuertoById(id: string): Promise<AeropuertoEntity | null> {
    return await aeropuertoRepository.findById(id);
  }

  async createAeropuerto(data: Omit<AeropuertoEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AeropuertoEntity> {
    // Validar que no exista un aeropuerto con el mismo código
    if (await aeropuertoRepository.findByCodigo(data.codigo)) {
      throw new Error('Ya existe un aeropuerto con este código');
    }

    return await aeropuertoRepository.create({
      ...data,
      codigo: data.codigo.toUpperCase(),
      activo: data.activo ?? true
    });
  }

  async updateAeropuerto(id: string, data: Partial<Omit<AeropuertoEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AeropuertoEntity> {
    const existing = await aeropuertoRepository.findById(id);
    if (!existing) {
      throw new Error('Aeropuerto no encontrado');
    }

    // Validar código único si se está actualizando
    if (data.codigo && data.codigo !== existing.codigo) {
      const existingCodigo = await aeropuertoRepository.findByCodigo(data.codigo);
      if (existingCodigo && existingCodigo.id !== id) {
        throw new Error('Ya existe un aeropuerto con este código');
      }
    }

    const updateData = {
      ...data,
      codigo: data.codigo ? data.codigo.toUpperCase() : undefined
    };

    return await aeropuertoRepository.update(id, updateData);
  }

  async deleteAeropuerto(id: string): Promise<AeropuertoEntity> {
    const existing = await aeropuertoRepository.findById(id);
    if (!existing) {
      throw new Error('Aeropuerto no encontrado');
    }

    return await aeropuertoRepository.softDelete(id);
  }

  async searchAeropuertos(query: string, includeInactive = false): Promise<AeropuertoEntity[]> {
    return await aeropuertoRepository.searchByName(query, includeInactive);
  }

  async getActiveCount(): Promise<number> {
    return await aeropuertoRepository.getActiveCount();
  }

  async paginateAeropuertos(page = 1, limit = 10, includeInactive = false) {
    return await aeropuertoRepository.paginate(page, limit, includeInactive);
  }

  async getAeropuertosActivos(): Promise<AeropuertoEntity[]> {
    return await aeropuertoRepository.findActivos();
  }
}

export const aeropuertoService = new AeropuertoService();