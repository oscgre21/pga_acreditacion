// src/lib/services/notificacion.service.ts
import { PrismaClient } from '@prisma/client'
import { NotificacionRepository } from '@/lib/repositories/notificacion.repository'

export class NotificacionService {
  private notificacionRepo: NotificacionRepository

  constructor(prisma?: PrismaClient) {
    const prismaInstance = prisma || new PrismaClient()
    this.notificacionRepo = new NotificacionRepository(prismaInstance)
  }

  async getByUsuario(usuarioId: number) {
    return this.notificacionRepo.findByUsuario(usuarioId)
  }

  async getUnreadCount(usuarioId: number) {
    return this.notificacionRepo.findUnreadCount(usuarioId)
  }

  async markAllAsRead(usuarioId: number) {
    return this.notificacionRepo.markAllAsRead(usuarioId)
  }

  async createNotification(usuarioId: number, titulo: string, descripcion: string, href?: string) {
    return this.notificacionRepo.create({
      usuario: { connect: { id: usuarioId } },
      titulo,
      descripcion,
      href,
    })
  }
}