// src/lib/dtos/usuario.dto.ts
import { z } from 'zod'
import { NivelPerfil } from '@prisma/client'

export const CreateUserSchema = z.object({
  nombre: z.string().min(1),
  usuario: z.string().min(3),
  correo: z.string().email(),
  telefono: z.string().optional(),
  rango: z.string().min(1),
  departamento: z.string().min(1),
  nivelPerfil: z.nativeEnum(NivelPerfil),
  password: z.string().min(6),
})

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true })

export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>