import { prisma } from '@/lib/prisma';
import { DocumentacionProcesoRepository, DocumentacionProcesoEntity } from '../repositories/documentacion-proceso.repository';

const documentacionProcesoRepository = new DocumentacionProcesoRepository(prisma);

export class DocumentacionProcesoService {
  async getAllDocumentacionProceso(includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    return await documentacionProcesoRepository.findAll(includeInactive);
  }

  async getDocumentacionProcesoById(id: string): Promise<DocumentacionProcesoEntity | null> {
    return await documentacionProcesoRepository.findById(id);
  }

  async createDocumentacionProceso(data: Omit<DocumentacionProcesoEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentacionProcesoEntity> {
    // Validar que no exista una documentación con el mismo nombre
    if (await documentacionProcesoRepository.findByNombre(data.nombre)) {
      throw new Error('Ya existe una documentación de proceso con este nombre');
    }

    return await documentacionProcesoRepository.create(data);
  }

  async updateDocumentacionProceso(id: string, data: Partial<Omit<DocumentacionProcesoEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DocumentacionProcesoEntity> {
    const existing = await documentacionProcesoRepository.findById(id);
    if (!existing) {
      throw new Error('Documentación de proceso no encontrada');
    }

    // Validar nombre único si se está actualizando
    if (data.nombre && data.nombre !== existing.nombre) {
      const existingNombre = await documentacionProcesoRepository.findByNombre(data.nombre);
      if (existingNombre && existingNombre.id !== id) {
        throw new Error('Ya existe una documentación de proceso con este nombre');
      }
    }

    return await documentacionProcesoRepository.update(id, data);
  }

  async deleteDocumentacionProceso(id: string): Promise<DocumentacionProcesoEntity> {
    const existing = await documentacionProcesoRepository.findById(id);
    if (!existing) {
      throw new Error('Documentación de proceso no encontrada');
    }

    return await documentacionProcesoRepository.softDelete(id);
  }

  async searchDocumentacionProceso(query: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    return await documentacionProcesoRepository.searchByName(query, includeInactive);
  }

  async getDocumentacionByProceso(proceso: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    return await documentacionProcesoRepository.findByProceso(proceso, includeInactive);
  }

  async getDocumentacionByCategoria(categoria: string, includeInactive = false): Promise<DocumentacionProcesoEntity[]> {
    return await documentacionProcesoRepository.findByCategoria(categoria, includeInactive);
  }

  async getActiveCount(): Promise<number> {
    return await documentacionProcesoRepository.getActiveCount();
  }

  async getObligatoriosCount(): Promise<number> {
    return await documentacionProcesoRepository.getObligatoriosCount();
  }

  async paginateDocumentacionProceso(page = 1, limit = 10, includeInactive = false) {
    return await documentacionProcesoRepository.paginate(page, limit, includeInactive);
  }
}

export const documentacionProcesoService = new DocumentacionProcesoService();