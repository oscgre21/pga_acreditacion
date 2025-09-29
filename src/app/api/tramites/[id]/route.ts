import { NextRequest, NextResponse } from 'next/server';
import { tramiteService } from '@/lib/services/tramite.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tramite = await tramiteService.getTramiteById(id);
    if (!tramite) {
      return NextResponse.json({ error: 'Tramite not found' }, { status: 404 });
    }
    return NextResponse.json(tramite);
  } catch (error) {
    console.error('Error fetching tramite:', error);
    return NextResponse.json({ error: 'Failed to fetch tramite' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const tramite = await tramiteService.updateTramite(id, data);
    return NextResponse.json(tramite);
  } catch (error) {
    console.error('Error updating tramite:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update tramite'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tramite = await tramiteService.deleteTramite(id);
    return NextResponse.json(tramite);
  } catch (error) {
    console.error('Error deleting tramite:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete tramite'
    }, { status: 500 });
  }
}