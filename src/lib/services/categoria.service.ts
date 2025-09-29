import { prisma } from '@/lib/prisma';
import { CategoriaRepository, CategoriaEntity } from '../repositories/categoria.repository';

const categoriaRepository = new CategoriaRepository(prisma);

export class CategoriaService {
  async getAllCategorias(includeInactive = false): Promise<CategoriaEntity[]> {
    return await categoriaRepository.findAll(includeInactive);
  }

  async getCategoriaById(id: string): Promise<CategoriaEntity | null> {
    return await categoriaRepository.findById(id);
  }

  async createCategoria(data: Omit<CategoriaEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoriaEntity> {
    // Validar que no exista una categoría con el mismo nombre
    if (await categoriaRepository.findByNombre(data.nombre)) {
      throw new Error('Ya existe una categoría con este nombre');
    }

    return await categoriaRepository.create(data);
  }

  async updateCategoria(id: string, data: Partial<Omit<CategoriaEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CategoriaEntity> {
    const existing = await categoriaRepository.findById(id);
    if (!existing) {
      throw new Error('Categoría no encontrada');
    }

    // Validar nombre único si se está actualizando
    if (data.nombre && data.nombre !== existing.nombre) {
      const existingNombre = await categoriaRepository.findByNombre(data.nombre);
      if (existingNombre && existingNombre.id !== id) {
        throw new Error('Ya existe una categoría con este nombre');
      }
    }

    return await categoriaRepository.update(id, data);
  }

  async deleteCategoria(id: string): Promise<CategoriaEntity> {
    const existing = await categoriaRepository.findById(id);
    if (!existing) {
      throw new Error('Categoría no encontrada');
    }

    return await categoriaRepository.softDelete(id);
  }

  async searchCategorias(query: string, includeInactive = false): Promise<CategoriaEntity[]> {
    return await categoriaRepository.searchByName(query, includeInactive);
  }

  async getActiveCount(): Promise<number> {
    return await categoriaRepository.getActiveCount();
  }

  async paginateCategorias(page = 1, limit = 10, includeInactive = false) {
    return await categoriaRepository.paginate(page, limit, includeInactive);
  }
}

export const categoriaService = new CategoriaService();