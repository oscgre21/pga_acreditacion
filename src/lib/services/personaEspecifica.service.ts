import { PrismaClient } from '@prisma/client';
import { PersonaEspecificaRepository, PersonaEspecificaEntity } from '../repositories/personaEspecifica.repository';

const prisma = new PrismaClient();
const personaEspecificaRepository = new PersonaEspecificaRepository(prisma);

export class PersonaEspecificaService {
  async getAllPersonasEspecificas(includeInactive = false): Promise<PersonaEspecificaEntity[]> {
    return await personaEspecificaRepository.findAll(includeInactive);
  }

  async getPersonaEspecificaById(id: string): Promise<PersonaEspecificaEntity | null> {
    return await personaEspecificaRepository.findById(id);
  }

  async getPersonaEspecificaByCedula(cedula: string): Promise<PersonaEspecificaEntity | null> {
    return await personaEspecificaRepository.findByCedula(cedula);
  }

  async createPersonaEspecifica(data: Omit<PersonaEspecificaEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonaEspecificaEntity> {
    // Validar que no exista una persona con la misma cédula
    if (await personaEspecificaRepository.findByCedula(data.cedula)) {
      throw new Error('Ya existe una persona específica con esta cédula');
    }

    return await personaEspecificaRepository.create(data);
  }

  async updatePersonaEspecifica(id: string, data: Partial<Omit<PersonaEspecificaEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PersonaEspecificaEntity> {
    const existing = await personaEspecificaRepository.findById(id);
    if (!existing) {
      throw new Error('Persona específica no encontrada');
    }

    // Validar cédula única si se está actualizando
    if (data.cedula && data.cedula !== existing.cedula) {
      const existingCedula = await personaEspecificaRepository.findByCedula(data.cedula);
      if (existingCedula && existingCedula.id !== id) {
        throw new Error('Ya existe una persona específica con esta cédula');
      }
    }

    return await personaEspecificaRepository.update(id, data);
  }

  async deletePersonaEspecifica(id: string): Promise<PersonaEspecificaEntity> {
    const existing = await personaEspecificaRepository.findById(id);
    if (!existing) {
      throw new Error('Persona específica no encontrada');
    }

    return await personaEspecificaRepository.softDelete(id);
  }

  async getPersonasEspecificasByCompania(companiaId: string): Promise<PersonaEspecificaEntity[]> {
    return await personaEspecificaRepository.findByCompania(companiaId);
  }

  async getPersonasEspecificasByFuncion(funcion: string): Promise<PersonaEspecificaEntity[]> {
    return await personaEspecificaRepository.findByFuncion(funcion);
  }

  async searchPersonasEspecificas(query: string): Promise<PersonaEspecificaEntity[]> {
    return await personaEspecificaRepository.searchByName(query);
  }

  async getActiveCount(): Promise<number> {
    return await personaEspecificaRepository.getActiveCount();
  }

  async getCountByCompania(companiaId: string): Promise<number> {
    return await personaEspecificaRepository.getCountByCompania(companiaId);
  }

  async paginatePersonasEspecificas(page = 1, limit = 10, includeInactive = false) {
    return await personaEspecificaRepository.paginate(page, limit, includeInactive);
  }
}

export const personaEspecificaService = new PersonaEspecificaService();