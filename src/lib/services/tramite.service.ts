import { prisma } from '@/lib/prisma';
import { TramiteRepository, TramiteEntity } from '../repositories/tramite.repository';
import { EstadoTramite } from '@prisma/client';

const tramiteRepository = new TramiteRepository(prisma);

export class TramiteService {
  async getAllTramites(includeInactive = false): Promise<TramiteEntity[]> {
    return await tramiteRepository.findAll(includeInactive);
  }

  async getTramiteById(id: string): Promise<TramiteEntity | null> {
    return await tramiteRepository.findById(id);
  }

  async createTramite(data: any): Promise<TramiteEntity> {
    // Generar número único para el trámite
    const numero = await this.generateTramiteNumber();

    const tramiteData = {
      ...data,
      numero,
    };

    return await tramiteRepository.createWithRelations(tramiteData);
  }

  async updateTramite(id: string, data: any): Promise<TramiteEntity> {
    const existing = await tramiteRepository.findById(id);
    if (!existing) {
      throw new Error('Trámite no encontrado');
    }

    return await tramiteRepository.updateWithRelations(id, data);
  }

  async deleteTramite(id: string): Promise<TramiteEntity> {
    const existing = await tramiteRepository.findById(id);
    if (!existing) {
      throw new Error('Trámite no encontrado');
    }

    return await tramiteRepository.softDelete(id);
  }

  async searchTramites(query: string): Promise<TramiteEntity[]> {
    return await tramiteRepository.searchByContent(query);
  }

  async getTramitesByEstado(estado: EstadoTramite): Promise<TramiteEntity[]> {
    return await tramiteRepository.findByEstado(estado);
  }

  async getTramitesBySolicitante(solicitante: string): Promise<TramiteEntity[]> {
    return await tramiteRepository.findBySolicitante(solicitante);
  }

  async getActiveCount(): Promise<number> {
    return await tramiteRepository.getActiveCount();
  }

  async getCountByEstado(estado: EstadoTramite): Promise<number> {
    return await tramiteRepository.getCountByEstado(estado);
  }

  async paginateTramites(page = 1, limit = 10, includeInactive = false) {
    return await tramiteRepository.paginate(page, limit, includeInactive);
  }

  async updateEstado(id: string, estado: EstadoTramite): Promise<TramiteEntity> {
    return await this.updateTramite(id, { estado });
  }

  private async generateTramiteNumber(): Promise<string> {
    // Generar número único basado en timestamp y contador
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `T-${timestamp}-${random}`;
  }
}

export const tramiteService = new TramiteService();