import { NextRequest, NextResponse } from 'next/server';
import { ejecutorService } from '@/lib/services/ejecutor.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ejecutor = await ejecutorService.getEjecutorById(params.id);
    if (!ejecutor) {
      return NextResponse.json({ error: 'Ejecutor not found' }, { status: 404 });
    }
    return NextResponse.json(ejecutor);
  } catch (error) {
    console.error('Error fetching ejecutor:', error);
    return NextResponse.json({ error: 'Failed to fetch ejecutor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const ejecutor = await ejecutorService.updateEjecutor(params.id, data);
    return NextResponse.json(ejecutor);
  } catch (error) {
    console.error('Error updating ejecutor:', error);
    return NextResponse.json({ error: 'Failed to update ejecutor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ejecutorService.deleteEjecutor(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ejecutor:', error);
    return NextResponse.json({ error: 'Failed to delete ejecutor' }, { status: 500 });
  }
}