// src/app/api/acreditaciones/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AcreditacionService } from '@/lib/services/acreditacion.service'

const acreditacionService = new AcreditacionService()

// GET /api/acreditaciones/dashboard - Obtener datos del dashboard
export async function GET(request: NextRequest) {
  try {
    const dashboardData = await acreditacionService.getDashboardData()

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener datos del dashboard',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}