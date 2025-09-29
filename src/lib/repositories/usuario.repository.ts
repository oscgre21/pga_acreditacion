// src/lib/repositories/usuario.repository.ts
import { PrismaClient } from '@prisma/client'
import { BaseRepository } from './base.repository'

interface UsuarioEntity {
  id: number;
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
}

export class UsuarioRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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
        fecha: new Date(),
        userAgent: 'Unknown',
        ip: '127.0.0.1', // Se capturará del request
      }
    })
  }

  async findById(id: number, include?: any) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include
    })
  }

  async create(data: any) {
    return this.prisma.usuario.create({
      data
    })
  }

  async update(id: number, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data
    })
  }
}