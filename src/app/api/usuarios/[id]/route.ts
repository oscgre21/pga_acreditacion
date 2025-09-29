// src/app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UsuarioService } from '@/lib/services/usuario.service'
import { UpdateUserSchema } from '@/lib/dtos/usuario.dto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const usuarioService = new UsuarioService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt(params.id)

    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const usuario = await usuarioService.getUserWithApps(usuarioId)

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error fetching usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo MASTER_KEY puede actualizar usuarios, o el usuario puede actualizarse a sí mismo
    const usuarioId = parseInt(params.id)
    if (session.user.nivelPerfil !== 'MASTER_KEY' && session.user.id !== usuarioId) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = UpdateUserSchema.parse(body)

    const usuarioActualizado = await usuarioService.updateUser(usuarioId, validatedData)
    return NextResponse.json(usuarioActualizado)
  } catch (error) {
    console.error('Error updating usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}