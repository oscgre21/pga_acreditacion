import { NextRequest, NextResponse } from 'next/server';
import { categoriaService } from '@/lib/services/categoria.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categoria = await categoriaService.getCategoriaById(id);
    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error fetching categoria:', error);
    return NextResponse.json({ error: 'Failed to fetch categoria' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const categoria = await categoriaService.updateCategoria(id, data);
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error updating categoria:', error);
    return NextResponse.json({ error: 'Failed to update categoria' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await categoriaService.deleteCategoria(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting categoria:', error);
    return NextResponse.json({ error: 'Failed to delete categoria' }, { status: 500 });
  }
}