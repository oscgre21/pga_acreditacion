import { NextRequest, NextResponse } from 'next/server';
import { categoriaService } from '@/lib/services/categoria.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');

    let categorias;

    if (search && search.trim()) {
      // Si hay término de búsqueda, usar searchCategorias
      categorias = await categoriaService.searchCategorias(search.trim(), includeInactive);
    } else {
      // Si no hay búsqueda, devolver todas las categorías
      categorias = await categoriaService.getAllCategorias(includeInactive);
    }

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json({ error: 'Failed to fetch categorias' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const categoria = await categoriaService.createCategoria(data);
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error creating categoria:', error);
    return NextResponse.json({ error: 'Failed to create categoria' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const categoria = await categoriaService.deleteCategoria(id);
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error deleting categoria:', error);
    return NextResponse.json({ error: 'Failed to delete categoria' }, { status: 500 });
  }
}