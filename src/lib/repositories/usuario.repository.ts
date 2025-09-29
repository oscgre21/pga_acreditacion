// src/lib/repositories/usuario.repository.ts
import { PrismaClient } from '@prisma/client'
import { BaseRepository } from './base.repository'

interface UsuarioEntity {
  id: string;
  nombre: string;
  usuario: string;
  correo: string;
  telefono?: string | null;
  activo: boolean;
  rango: string;
  departamento: string;
  nivelPerfil: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  estado: 'ACTIVO' | 'INACTIVO';
}

export class UsuarioRepository extends BaseRepository<UsuarioEntity> {
  protected modelName = 'usuario';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findByEmail(correo: string) {
    return this.prisma.usuario.findUnique({
      where: { correo },
      include: {
        appsConcedidas: {
          include: {
            app: true
          }
        },
        ultimosAccesos: {
          include: {
            app: true
          },
          orderBy: {
            fecha: 'desc'
          },
          take: 5
        }
      }
    })
  }

  async findByUsuario(usuario: string) {
    return this.prisma.usuario.findUnique({
      where: { usuario },
      include: {
        appsConcedidas: {
          where: { activa: true },
          include: {
            app: true
          }
        }
      }
    })
  }

  async findActiveUsers() {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      include: {
        appsConcedidas: {
          where: { activa: true },
          include: {
            app: true
          }
        }
      }
    })
  }

  async updateLastAccess(usuarioId: number, appId: string) {
    return this.prisma.accesoApp.create({
      data: {
        usuarioId,
        appId,
        hora: new Date().toLocaleTimeString(),
        ipAddress: '127.0.0.1', // Se capturará del request
      }
    })
  }
}