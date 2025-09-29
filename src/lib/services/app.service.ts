// src/lib/services/app.service.ts
import { AppRepository } from '@/lib/repositories/app.repository'

export class AppService {
  private appRepo: AppRepository

  constructor() {
    this.appRepo = new AppRepository()
  }

  async getActiveAppsWithStats() {
    return this.appRepo.findActiveApps()
  }

  async getAppWithDetails(appId: string) {
    return this.appRepo.findWithStats(appId)
  }

  async getAllApps() {
    return this.appRepo.findMany({}, {
      auditor: true,
      assignedDev: true,
      backendDev: true,
      frontendDev: true,
      detallesTecnicos: true,
      incidentes: true,
      _count: {
        select: {
          usuariosApp: {
            where: { activa: true }
          }
        }
      }
    })
  }
}