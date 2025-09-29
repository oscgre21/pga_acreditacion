import { NextRequest, NextResponse } from 'next/server';
import { documentacionProcesoService } from '@/lib/services/documentacion-proceso.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const search = searchParams.get('search');
    const proceso = searchParams.get('proceso');
    const categoria = searchParams.get('categoria');

    let documentacionProceso;

    if (search && search.trim()) {
      // Si hay término de búsqueda, usar searchDocumentacionProceso
      documentacionProceso = await documentacionProcesoService.searchDocumentacionProceso(search.trim(), includeInactive);
    } else if (proceso) {
      // Si hay filtro de proceso
      documentacionProceso = await documentacionProcesoService.getDocumentacionByProceso(proceso, includeInactive);
    } else if (categoria) {
      // Si hay filtro de categoría
      documentacionProceso = await documentacionProcesoService.getDocumentacionByCategoria(categoria, includeInactive);
    } else {
      // Si no hay búsqueda, devolver toda la documentación
      documentacionProceso = await documentacionProcesoService.getAllDocumentacionProceso(includeInactive);
    }

    return NextResponse.json(documentacionProceso);
  } catch (error) {
    console.error('Error fetching documentacion proceso:', error);
    return NextResponse.json({ error: 'Failed to fetch documentacion proceso' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const documentacionProceso = await documentacionProcesoService.createDocumentacionProceso(data);
    return NextResponse.json(documentacionProceso);
  } catch (error) {
    console.error('Error creating documentacion proceso:', error);
    return NextResponse.json({ error: 'Failed to create documentacion proceso' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const documentacionProceso = await documentacionProcesoService.deleteDocumentacionProceso(id);
    return NextResponse.json(documentacionProceso);
  } catch (error) {
    console.error('Error deleting documentacion proceso:', error);
    return NextResponse.json({ error: 'Failed to delete documentacion proceso' }, { status: 500 });
  }
}