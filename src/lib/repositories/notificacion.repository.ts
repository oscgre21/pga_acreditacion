// src/lib/repositories/notificacion.repository.ts
import { Notificacion, Prisma, PrismaClient } from '@prisma/client'
import { BaseRepository } from './base.repository'

export class NotificacionRepository extends BaseRepository<Notificacion> {
  protected modelName = 'notificacion';

  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async findByUsuario(usuarioId: number) {
    return this.model.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findUnreadCount(usuarioId: number) {
    return this.model.count({
      where: {
        usuarioId,
        leida: false
      }
    })
  }

  async markAllAsRead(usuarioId: number) {
    return this.model.updateMany({
      where: {
        usuarioId,
        leida: false
      },
      data: { leida: true }
    })
  }
}