import { NextRequest, NextResponse } from 'next/server';
import { aeropuertoService } from '@/lib/services/aeropuerto.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const aeropuerto = await aeropuertoService.getAeropuertoById(id);
    if (!aeropuerto) {
      return NextResponse.json({ error: 'Aeropuerto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(aeropuerto);
  } catch (error) {
    console.error('Error fetching aeropuerto:', error);
    return NextResponse.json({ error: 'Failed to fetch aeropuerto' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const aeropuerto = await aeropuertoService.updateAeropuerto(id, data);
    return NextResponse.json(aeropuerto);
  } catch (error) {
    console.error('Error updating aeropuerto:', error);
    return NextResponse.json({ error: 'Failed to update aeropuerto' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await aeropuertoService.deleteAeropuerto(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting aeropuerto:', error);
    return NextResponse.json({ error: 'Failed to delete aeropuerto' }, { status: 500 });
  }
}