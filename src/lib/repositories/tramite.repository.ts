import { PrismaClient, Tramite, EstadoTramite } from '@prisma/client';

export interface TramiteEntity extends Tramite {}

export class TramiteRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private get model() {
    return this.prisma.tramite;
  }

  async findAll(includeInactive = false): Promise<TramiteEntity[]> {
    return await this.model.findMany({
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
          }
        },
        aeropuertos: {
          include: {
            aeropuerto: true
          }
        },
        equiposSeguridad: {
          include: {
            equipoSeguridad: true
          }
        },
        serviciosSeguridad: {
          include: {
            servicioSeguridad: true
          }
        },
        categoriasPersonal: {
          include: {
            categoriaPersonal: true
          }
        },
        categorias: {
          include: {
            categoria: true
          }
        },
        tiposDocumento: {
          include: {
            tipoDocumento: true
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });
  }

  async findById(id: string): Promise<TramiteEntity | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
          }
        },
        aeropuertos: {
          include: {
            aeropuerto: true
          }
        },
        equiposSeguridad: {
          include: {
            equipoSeguridad: true
          }
        },
        serviciosSeguridad: {
          include: {
            servicioSeguridad: true
          }
        },
        categoriasPersonal: {
          include: {
            categoriaPersonal: true
          }
        },
        categorias: {
          include: {
            categoria: true
          }
        },
        tiposDocumento: {
          include: {
            tipoDocumento: true
          }
        }
      }
    });
  }

  async searchByContent(query: string): Promise<TramiteEntity[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { numero: { contains: query, mode: 'insensitive' } },
          { solicitante: { contains: query, mode: 'insensitive' } },
          { personal: { contains: query, mode: 'insensitive' } },
          { tipo: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });
  }

  async findByEstado(estado: EstadoTramite): Promise<TramiteEntity[]> {
    return await this.model.findMany({
      where: { estado },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });
  }

  async findBySolicitante(solicitante: string): Promise<TramiteEntity[]> {
    return await this.model.findMany({
      where: {
        solicitante: {
          contains: solicitante,
          mode: 'insensitive'
        }
      },
      include: {
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });
  }

  async getActiveCount(): Promise<number> {
    return await this.model.count({
      where: {
        estado: {
          notIn: ['CANCELADO', 'COMPLETADO']
        }
      }
    });
  }

  async getCountByEstado(estado: EstadoTramite): Promise<number> {
    return await this.model.count({
      where: { estado }
    });
  }

  async paginate(page = 1, limit = 10, includeInactive = false) {
    const where = includeInactive ? {} : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          usuarioCreador: {
            select: {
              id: true,
              nombre: true,
              usuario: true,
            }
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        },
        skip,
        take: limit,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string): Promise<TramiteEntity> {
    return await this.model.update({
      where: { id },
      data: {
        estado: 'CANCELADO',
        fechaActualizacion: new Date(),
      }
    });
  }

  async searchByName(query: string): Promise<TramiteEntity[]> {
    return this.searchByContent(query);
  }

  async create(data: Omit<TramiteEntity, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<TramiteEntity> {
    return await this.model.create({
      data: {
        ...data,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      }
    });
  }

  async update(id: string, data: Partial<Omit<TramiteEntity, 'id' | 'fechaCreacion'>>): Promise<TramiteEntity> {
    return await this.model.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date(),
      }
    });
  }

  async updateWithRelations(id: string, data: any): Promise<TramiteEntity> {
    const { aeropuertos, equiposSeguridad, serviciosSeguridad, categoriasPersonal, categorias, tiposDocumento, ...tramiteData } = data;

    return await this.prisma.$transaction(async (tx) => {
      // Actualizar trámite base
      const tramite = await tx.tramite.update({
        where: { id },
        data: {
          ...tramiteData,
          fechaActualizacion: new Date(),
        }
      });

      // Limpiar relaciones existentes
      await tx.tramiteAeropuerto.deleteMany({ where: { tramiteId: id } });
      await tx.tramiteEquipoSeguridad.deleteMany({ where: { tramiteId: id } });
      await tx.tramiteServicioSeguridad.deleteMany({ where: { tramiteId: id } });
      await tx.tramiteCategoriaPersonal.deleteMany({ where: { tramiteId: id } });
      await tx.tramiteCategoria.deleteMany({ where: { tramiteId: id } });
      await tx.tramiteTipoDocumento.deleteMany({ where: { tramiteId: id } });

      // Crear nuevas relaciones
      if (aeropuertos?.length) {
        await tx.tramiteAeropuerto.createMany({
          data: aeropuertos.map((aeropuertoId: string) => ({
            tramiteId: id,
            aeropuertoId
          }))
        });
      }

      if (equiposSeguridad?.length) {
        await tx.tramiteEquipoSeguridad.createMany({
          data: equiposSeguridad.map((equipoId: string) => ({
            tramiteId: id,
            equipoSeguridadId: equipoId
          }))
        });
      }

      if (serviciosSeguridad?.length) {
        await tx.tramiteServicioSeguridad.createMany({
          data: serviciosSeguridad.map((servicioId: string) => ({
            tramiteId: id,
            servicioSeguridadId: servicioId
          }))
        });
      }

      if (categoriasPersonal?.length) {
        await tx.tramiteCategoriaPersonal.createMany({
          data: categoriasPersonal.map((categoriaId: string) => ({
            tramiteId: id,
            categoriaPersonalId: categoriaId
          }))
        });
      }

      if (categorias?.length) {
        await tx.tramiteCategoria.createMany({
          data: categorias.map((categoriaId: string) => ({
            tramiteId: id,
            categoriaId
          }))
        });
      }

      if (tiposDocumento?.length) {
        console.log("🔍 Repository tiposDocumento:", tiposDocumento);
        const mappedData = tiposDocumento.map((doc: any) => ({
          tramiteId: id,
          tipoDocumentoId: doc.tipoDocumentoId,
          descripcion: doc.descripcion,
          nota: doc.nota,
          obligatorio: doc.obligatorio,
          departamentos: doc.departamentos
        }));
        console.log("📋 Mapped data for createMany:", mappedData);

        await tx.tramiteTipoDocumento.createMany({
          data: mappedData
        });
      }

      return tramite;
    });
  }

  async createWithRelations(data: any): Promise<TramiteEntity> {
    const { aeropuertos, equiposSeguridad, serviciosSeguridad, categoriasPersonal, categorias, tiposDocumento, ...tramiteData } = data;

    return await this.prisma.$transaction(async (tx) => {
      // Crear trámite base
      const tramite = await tx.tramite.create({
        data: {
          ...tramiteData,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        }
      });

      // Crear relaciones
      if (aeropuertos?.length) {
        await tx.tramiteAeropuerto.createMany({
          data: aeropuertos.map((aeropuertoId: string) => ({
            tramiteId: tramite.id,
            aeropuertoId
          }))
        });
      }

      if (equiposSeguridad?.length) {
        await tx.tramiteEquipoSeguridad.createMany({
          data: equiposSeguridad.map((equipoId: string) => ({
            tramiteId: tramite.id,
            equipoSeguridadId: equipoId
          }))
        });
      }

      if (serviciosSeguridad?.length) {
        await tx.tramiteServicioSeguridad.createMany({
          data: serviciosSeguridad.map((servicioId: string) => ({
            tramiteId: tramite.id,
            servicioSeguridadId: servicioId
          }))
        });
      }

      if (categoriasPersonal?.length) {
        await tx.tramiteCategoriaPersonal.createMany({
          data: categoriasPersonal.map((categoriaId: string) => ({
            tramiteId: tramite.id,
            categoriaPersonalId: categoriaId
          }))
        });
      }

      if (categorias?.length) {
        await tx.tramiteCategoria.createMany({
          data: categorias.map((categoriaId: string) => ({
            tramiteId: tramite.id,
            categoriaId
          }))
        });
      }

      if (tiposDocumento?.length) {
        await tx.tramiteTipoDocumento.createMany({
          data: tiposDocumento.map((doc: any) => ({
            tramiteId: tramite.id,
            tipoDocumentoId: doc.tipoDocumentoId,
            descripcion: doc.descripcion,
            nota: doc.nota,
            obligatorio: doc.obligatorio,
            departamentos: doc.departamentos
          }))
        });
      }

      return tramite;
    });
  }
}