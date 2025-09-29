// src/app/api/acreditaciones/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AcreditacionService } from '@/lib/services/acreditacion.service'

const acreditacionService = new AcreditacionService()

// GET /api/acreditaciones/[id] - Obtener acreditación específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de acreditación requerido'
        },
        { status: 400 }
      )
    }

    const acreditacion = await acreditacionService.getAcreditacionById(id)

    if (!acreditacion) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acreditación no encontrada'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: acreditacion
    })
  } catch (error) {
    console.error('Error fetching acreditación:', error)
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

// PATCH /api/acreditaciones/[id] - Actualizar acreditación
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de acreditación requerido'
        },
        { status: 400 }
      )
    }

    // Convertir fechas si están presentes
    if (body.fechaVencimiento) {
      body.fechaVencimiento = new Date(body.fechaVencimiento)
    }

    const acreditacionActualizada = await acreditacionService.updateAcreditacion(id, body)

    return NextResponse.json({
      success: true,
      data: acreditacionActualizada,
      message: 'Acreditación actualizada exitosamente'
    })
  } catch (error) {
    console.error('Error updating acreditación:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar acreditación',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/acreditaciones/[id] - Eliminar acreditación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de acreditación requerido'
        },
        { status: 400 }
      )
    }

    await acreditacionService.deleteAcreditacion(id)

    return NextResponse.json({
      success: true,
      message: 'Acreditación eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting acreditación:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar acreditación',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}