// src/app/api/notificaciones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NotificacionService } from '@/lib/services/notificacion.service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const notificacionService = new NotificacionService()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const notificaciones = await notificacionService.getByUsuario(session.user.id)
    return NextResponse.json(notificaciones)
  } catch (error) {
    console.error('Error fetching notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await notificacionService.markAllAsRead(session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}