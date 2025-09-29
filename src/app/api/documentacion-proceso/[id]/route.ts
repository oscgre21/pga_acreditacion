import { NextRequest, NextResponse } from 'next/server';
import { documentacionProcesoService } from '@/lib/services/documentacion-proceso.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const documentacionProceso = await documentacionProcesoService.getDocumentacionProcesoById(id);

    if (!documentacionProceso) {
      return NextResponse.json({ error: 'Documentacion proceso not found' }, { status: 404 });
    }

    return NextResponse.json(documentacionProceso);
  } catch (error) {
    console.error('Error fetching documentacion proceso:', error);
    return NextResponse.json({ error: 'Failed to fetch documentacion proceso' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    const documentacionProceso = await documentacionProcesoService.updateDocumentacionProceso(id, data);
    return NextResponse.json(documentacionProceso);
  } catch (error) {
    console.error('Error updating documentacion proceso:', error);
    return NextResponse.json({ error: 'Failed to update documentacion proceso' }, { status: 500 });
  }
}