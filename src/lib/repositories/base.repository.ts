import { PrismaClient } from '@prisma/client';

export interface BaseEntity {
  id: string;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected prisma: PrismaClient;
  protected abstract modelName: string;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected get model() {
    return (this.prisma as any)[this.modelName];
  }

  async findAll(includeInactive = false): Promise<T[]> {
    const where = includeInactive ? {} : { estado: 'ACTIVO' };
    return await this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id }
    });
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return await this.model.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return await this.model.create({
      data: {
        ...data,
        estado: data.estado || 'ACTIVO'
      }
    });
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
    return await this.model.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<T> {
    return await this.model.update({
      where: { id },
      data: { estado: 'INACTIVO' }
    });
  }

  async hardDelete(id: string): Promise<T> {
    return await this.model.delete({
      where: { id }
    });
  }

  async count(includeInactive = false): Promise<number> {
    const where = includeInactive ? {} : { estado: 'ACTIVO' };
    return await this.model.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.model.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!result;
  }

  async findByField(field: string, value: any): Promise<T[]> {
    return await this.model.findMany({
      where: {
        [field]: value,
        estado: 'ACTIVO'
      }
    });
  }

  async findOneByField(field: string, value: any): Promise<T | null> {
    return await this.model.findFirst({
      where: {
        [field]: value,
        estado: 'ACTIVO'
      }
    });
  }

  async paginate(page = 1, limit = 10, includeInactive = false) {
    const offset = (page - 1) * limit;
    const where = includeInactive ? {} : { estado: 'ACTIVO' };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
  }

  // Métodos de compatibilidad con el repositorio anterior
  async findMany(where?: any, include?: any): Promise<T[]> {
    return this.model.findMany({ where, include });
  }

  async delete(id: string | number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}