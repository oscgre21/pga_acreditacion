import { NextRequest, NextResponse } from 'next/server';
import { servicioSeguridadService } from '@/lib/services/servicio-seguridad.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const servicio = await servicioSeguridadService.getServicioSeguridadById(params.id);
    if (!servicio) {
      return NextResponse.json({ error: 'Servicio de seguridad not found' }, { status: 404 });
    }
    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error fetching servicio de seguridad:', error);
    return NextResponse.json({ error: 'Failed to fetch servicio de seguridad' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const servicio = await servicioSeguridadService.updateServicioSeguridad(params.id, data);
    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error updating servicio de seguridad:', error);
    return NextResponse.json({ error: 'Failed to update servicio de seguridad' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await servicioSeguridadService.deleteServicioSeguridad(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting servicio de seguridad:', error);
    return NextResponse.json({ error: 'Failed to delete servicio de seguridad' }, { status: 500 });
  }
}