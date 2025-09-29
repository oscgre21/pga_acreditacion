// src/lib/repositories/app.repository.ts
import { PrismaClient } from '@prisma/client'
import { BaseRepository } from './base.repository'

interface AppEntity {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  version: string;
  lastUpdate: Date;
  lastAudit: Date;
  auditorId?: number | null;
  clientId: string;
  code: string;
  urlDestino: string;
  redirectUrl: string;
  assignedDevId?: number | null;
  backendDevId?: number | null;
  frontendDevId?: number | null;
  users72h: number;
  totalUsers: number;
  createdAt: Date;
  updatedAt: Date;
  estado: 'ACTIVO' | 'INACTIVO';
}

export class AppRepository extends BaseRepository<AppEntity> {
  protected modelName = 'app';

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findActiveApps() {
    return this.prisma.app.findMany({
      where: { activa: true },
      include: {
        auditor: true,
        assignedDev: true,
        backendDev: true,
        frontendDev: true,
        detallesTecnicos: true,
        incidentes: {
          where: { resuelto: false }
        },
        _count: {
          select: {
            usuariosApp: {
              where: { activa: true }
            }
          }
        }
      }
    })
  }

  async findWithStats(appId: string) {
    return this.prisma.app.findUnique({
      where: { id: appId },
      include: {
        auditor: true,
        detallesTecnicos: true,
        incidentes: true,
        usuariosApp: {
          include: {
            usuario: true
          }
        },
        accesos: {
          where: {
            fecha: {
              gte: new Date(Date.now() - 72 * 60 * 60 * 1000) // últimas 72h
            }
          }
        }
      }
    })
  }
}