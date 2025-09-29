import { NextRequest, NextResponse } from 'next/server';
import { ejecutorService } from '@/lib/services/ejecutor.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');

    let ejecutores;
    if (search && search.trim()) {
      ejecutores = await ejecutorService.searchEjecutores(search.trim());
    } else {
      ejecutores = await ejecutorService.getAllEjecutores(includeInactive);
    }

    return NextResponse.json(ejecutores);
  } catch (error) {
    console.error('Error fetching ejecutores:', error);
    return NextResponse.json({ error: 'Failed to fetch ejecutores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ejecutor = await ejecutorService.createEjecutor(data);
    return NextResponse.json(ejecutor);
  } catch (error) {
    console.error('Error creating ejecutor:', error);
    return NextResponse.json({ error: 'Failed to create ejecutor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const ejecutor = await ejecutorService.deleteEjecutor(id);
    return NextResponse.json(ejecutor);
  } catch (error) {
    console.error('Error deleting ejecutor:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete ejecutor'
    }, { status: 500 });
  }
}