import { NextRequest, NextResponse } from 'next/server';
import { dependenciaService } from '@/lib/services/dependencia.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');

    let dependencias;
    if (search && search.trim()) {
      dependencias = await dependenciaService.searchDependencias(search.trim());
    } else {
      dependencias = await dependenciaService.getAllDependencias(includeInactive);
    }

    return NextResponse.json(dependencias);
  } catch (error) {
    console.error('Error fetching dependencias:', error);
    return NextResponse.json({ error: 'Failed to fetch dependencias' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const dependencia = await dependenciaService.createDependencia(data);
    return NextResponse.json(dependencia);
  } catch (error) {
    console.error('Error creating dependencia:', error);
    return NextResponse.json({ error: 'Failed to create dependencia' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const dependencia = await dependenciaService.deleteDependencia(id);
    return NextResponse.json(dependencia);
  } catch (error) {
    console.error('Error deleting dependencia:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete dependencia'
    }, { status: 500 });
  }
}