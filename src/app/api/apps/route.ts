// src/app/api/apps/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AppService } from '@/lib/services/app.service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const appService = new AppService()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const apps = await appService.getActiveAppsWithStats()
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Error fetching apps:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}