import { NextRequest, NextResponse } from 'next/server';
import { servicioSeguridadService } from '@/lib/services/servicio-seguridad.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const servicios = await servicioSeguridadService.getAllServiciosSeguridad(includeInactive);
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error fetching servicios de seguridad:', error);
    return NextResponse.json({ error: 'Failed to fetch servicios de seguridad' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const servicio = await servicioSeguridadService.createServicioSeguridad(data);
    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error creating servicio de seguridad:', error);
    return NextResponse.json({ error: 'Failed to create servicio de seguridad' }, { status: 500 });
  }
}