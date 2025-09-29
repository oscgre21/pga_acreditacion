import { NextRequest, NextResponse } from 'next/server';
import { dependenciaService } from '@/lib/services/dependencia.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dependencia = await dependenciaService.getDependenciaById(params.id);
    if (!dependencia) {
      return NextResponse.json({ error: 'Dependencia not found' }, { status: 404 });
    }
    return NextResponse.json(dependencia);
  } catch (error) {
    console.error('Error fetching dependencia:', error);
    return NextResponse.json({ error: 'Failed to fetch dependencia' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const dependencia = await dependenciaService.updateDependencia(params.id, data);
    return NextResponse.json(dependencia);
  } catch (error) {
    console.error('Error updating dependencia:', error);
    return NextResponse.json({ error: 'Failed to update dependencia' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dependenciaService.deleteDependencia(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dependencia:', error);
    return NextResponse.json({ error: 'Failed to delete dependencia' }, { status: 500 });
  }
}