import { NextRequest, NextResponse } from 'next/server';
import { validadorService } from '@/lib/services/validador.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');

    let validadores;
    if (search && search.trim()) {
      validadores = await validadorService.searchValidadores(search.trim());
    } else {
      validadores = await validadorService.getAllValidadores(includeInactive);
    }

    return NextResponse.json(validadores);
  } catch (error) {
    console.error('Error fetching validadores:', error);
    return NextResponse.json({ error: 'Failed to fetch validadores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validador = await validadorService.createValidador(data);
    return NextResponse.json(validador);
  } catch (error) {
    console.error('Error creating validador:', error);
    return NextResponse.json({ error: 'Failed to create validador' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const validador = await validadorService.deleteValidador(id);
    return NextResponse.json(validador);
  } catch (error) {
    console.error('Error deleting validador:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete validador'
    }, { status: 500 });
  }
}