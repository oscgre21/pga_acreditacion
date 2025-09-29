import { NextRequest, NextResponse } from 'next/server';
import { companiaService } from '@/lib/services/compania.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const compania = await companiaService.getCompaniaById(params.id);
    if (!compania) {
      return NextResponse.json({ error: 'Compania not found' }, { status: 404 });
    }
    return NextResponse.json(compania);
  } catch (error) {
    console.error('Error fetching compania:', error);
    return NextResponse.json({ error: 'Failed to fetch compania' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const compania = await companiaService.updateCompania(params.id, data);
    return NextResponse.json(compania);
  } catch (error) {
    console.error('Error updating compania:', error);
    return NextResponse.json({ error: 'Failed to update compania' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await companiaService.deleteCompania(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting compania:', error);
    return NextResponse.json({ error: 'Failed to delete compania' }, { status: 500 });
  }
}