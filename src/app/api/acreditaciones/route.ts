// src/app/api/acreditaciones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AcreditacionService } from '@/lib/services/acreditacion.service'
import { EstadoAcreditacion } from '@prisma/client'

const acreditacionService = new AcreditacionService()

// GET /api/acreditaciones - Obtener todas las acreditaciones con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Construir filtros desde query parameters
    const filtros: any = {}

    if (searchParams.get('aeropuertoId')) {
      filtros.aeropuertoId = searchParams.get('aeropuertoId')
    }

    if (searchParams.get('estado')) {
      filtros.estado = searchParams.get('estado') as EstadoAcreditacion
    }

    if (searchParams.get('hasWarning')) {
      filtros.hasWarning = searchParams.get('hasWarning') === 'true'
    }

    if (searchParams.get('solicitante')) {
      filtros.solicitante = searchParams.get('solicitante')
    }

    if (searchParams.get('personal')) {
      filtros.personal = searchParams.get('personal')
    }

    if (searchParams.get('fechaIngresoDesde')) {
      filtros.fechaIngresoDesde = new Date(searchParams.get('fechaIngresoDesde')!)
    }

    if (searchParams.get('fechaIngresoHasta')) {
      filtros.fechaIngresoHasta = new Date(searchParams.get('fechaIngresoHasta')!)
    }

    if (searchParams.get('fechaVencimientoDesde')) {
      filtros.fechaVencimientoDesde = new Date(searchParams.get('fechaVencimientoDesde')!)
    }

    if (searchParams.get('fechaVencimientoHasta')) {
      filtros.fechaVencimientoHasta = new Date(searchParams.get('fechaVencimientoHasta')!)
    }

    const acreditaciones = await acreditacionService.getAllAcreditaciones(filtros)

    return NextResponse.json({
      success: true,
      data: acreditaciones,
      total: acreditaciones.length
    })
  } catch (error) {
    console.error('Error fetching acreditaciones:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/acreditaciones - Crear nueva acreditación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = [
      'numero',
      'solicitante',
      'aeropuertoId',
      'categoria',
      'proceso',
      'subproceso',
      'referencia',
      'fechaVencimiento',
      'ejecutores',
      'validadores'
    ]

    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos requeridos faltantes',
          missingFields
        },
        { status: 400 }
      )
    }

    // Convertir fecha de vencimiento
    if (body.fechaVencimiento) {
      body.fechaVencimiento = new Date(body.fechaVencimiento)
    }

    const nuevaAcreditacion = await acreditacionService.createAcreditacion(body)

    return NextResponse.json({
      success: true,
      data: nuevaAcreditacion,
      message: 'Acreditación creada exitosamente'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating acreditación:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear acreditación',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}