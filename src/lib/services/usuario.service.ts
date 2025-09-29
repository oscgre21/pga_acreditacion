// src/lib/services/usuario.service.ts
import { UsuarioRepository } from '@/lib/repositories/usuario.repository'
import { CreateUserDTO } from '@/lib/dtos/usuario.dto'
import bcrypt from 'bcryptjs'

export class UsuarioService {
  private usuarioRepo: UsuarioRepository

  constructor() {
    this.usuarioRepo = new UsuarioRepository()
  }

  async authenticateUser(usuario: string, password: string) {
    const user = await this.usuarioRepo.findByUsuario(usuario)

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o inactivo')
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta')
    }

    // Omitir password hash en la respuesta
    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getUserWithApps(usuarioId: number) {
    return this.usuarioRepo.findById(usuarioId, {
      appsConcedidas: {
        where: { activa: true },
        include: {
          app: {
            where: { activa: true },
            include: {
              detallesTecnicos: true,
              incidentes: {
                where: { resuelto: false }
              }
            }
          }
        }
      },
      ultimosAccesos: {
        include: {
          app: true
        },
        orderBy: {
          fecha: 'desc'
        },
        take: 10
      }
    })
  }

  async getAllActiveUsers() {
    return this.usuarioRepo.findActiveUsers()
  }

  async createUser(userData: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return this.usuarioRepo.create({
      ...userData,
      passwordHash: hashedPassword
    })
  }

  async updateUser(id: number, userData: Partial<CreateUserDTO>) {
    const { password, ...updateData } = userData

    const finalUpdateData: any = updateData

    if (password) {
      finalUpdateData.passwordHash = await bcrypt.hash(password, 10)
    }

    return this.usuarioRepo.update(id, finalUpdateData)
  }
}