import { NextRequest, NextResponse } from 'next/server';
import { tramiteService } from '@/lib/services/tramite.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');
    const estado = searchParams.get('estado');
    const solicitante = searchParams.get('solicitante');

    let tramites;
    if (search && search.trim()) {
      tramites = await tramiteService.searchTramites(search.trim());
    } else if (estado) {
      tramites = await tramiteService.getTramitesByEstado(estado as any);
    } else if (solicitante) {
      tramites = await tramiteService.getTramitesBySolicitante(solicitante);
    } else {
      tramites = await tramiteService.getAllTramites(includeInactive);
    }

    return NextResponse.json(tramites);
  } catch (error) {
    console.error('Error fetching tramites:', error);
    return NextResponse.json({ error: 'Failed to fetch tramites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const tramite = await tramiteService.createTramite(data);
    return NextResponse.json(tramite);
  } catch (error) {
    console.error('Error creating tramite:', error);
    return NextResponse.json({ error: 'Failed to create tramite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const tramite = await tramiteService.deleteTramite(id);
    return NextResponse.json(tramite);
  } catch (error) {
    console.error('Error deleting tramite:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete tramite'
    }, { status: 500 });
  }
}