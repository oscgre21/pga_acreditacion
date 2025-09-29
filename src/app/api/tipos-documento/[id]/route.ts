import { NextRequest, NextResponse } from 'next/server';
import { tipoDocumentoService } from '@/lib/services/tipo-documento.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tipo = await tipoDocumentoService.getTipoDocumentoById(id);
    if (!tipo) {
      return NextResponse.json({ error: 'Tipo de documento not found' }, { status: 404 });
    }
    return NextResponse.json(tipo);
  } catch (error) {
    console.error('Error fetching tipo de documento:', error);
    return NextResponse.json({ error: 'Failed to fetch tipo de documento' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const tipo = await tipoDocumentoService.updateTipoDocumento(id, data);
    return NextResponse.json(tipo);
  } catch (error) {
    console.error('Error updating tipo de documento:', error);
    return NextResponse.json({ error: 'Failed to update tipo de documento' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await tipoDocumentoService.deleteTipoDocumento(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tipo de documento:', error);
    return NextResponse.json({ error: 'Failed to delete tipo de documento' }, { status: 500 });
  }
}