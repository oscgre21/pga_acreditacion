import { NextRequest, NextResponse } from 'next/server';
import { aeropuertoService } from '@/lib/services/aeropuerto.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');

    let aeropuertos;

    if (search && search.trim()) {
      // Si hay término de búsqueda, usar searchAeropuertos
      aeropuertos = await aeropuertoService.searchAeropuertos(search.trim(), includeInactive);
    } else {
      // Si no hay búsqueda, devolver todos los aeropuertos
      aeropuertos = await aeropuertoService.getAllAeropuertos(includeInactive);
    }

    return NextResponse.json(aeropuertos);
  } catch (error) {
    console.error('Error fetching aeropuertos:', error);
    return NextResponse.json({ error: 'Failed to fetch aeropuertos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const aeropuerto = await aeropuertoService.createAeropuerto(data);
    return NextResponse.json(aeropuerto);
  } catch (error) {
    console.error('Error creating aeropuerto:', error);
    return NextResponse.json({ error: 'Failed to create aeropuerto' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const aeropuerto = await aeropuertoService.deleteAeropuerto(id);
    return NextResponse.json(aeropuerto);
  } catch (error) {
    console.error('Error deleting aeropuerto:', error);
    return NextResponse.json({ error: 'Failed to delete aeropuerto' }, { status: 500 });
  }
}