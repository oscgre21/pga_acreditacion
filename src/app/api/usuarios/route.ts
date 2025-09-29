// src/app/api/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UsuarioService } from '@/lib/services/usuario.service'
import { CreateUserSchema } from '@/lib/dtos/usuario.dto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const usuarioService = new UsuarioService()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuarios = await usuarioService.getAllActiveUsers()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error fetching usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.nivelPerfil !== 'MASTER_KEY') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = CreateUserSchema.parse(body)

    const nuevoUsuario = await usuarioService.createUser(validatedData)
    return NextResponse.json(nuevoUsuario, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}