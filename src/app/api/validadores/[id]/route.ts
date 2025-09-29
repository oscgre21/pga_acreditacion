import { NextRequest, NextResponse } from 'next/server';
import { validadorService } from '@/lib/services/validador.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const validador = await validadorService.getValidadorById(params.id);
    if (!validador) {
      return NextResponse.json({ error: 'Validador not found' }, { status: 404 });
    }
    return NextResponse.json(validador);
  } catch (error) {
    console.error('Error fetching validador:', error);
    return NextResponse.json({ error: 'Failed to fetch validador' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const validador = await validadorService.updateValidador(params.id, data);
    return NextResponse.json(validador);
  } catch (error) {
    console.error('Error updating validador:', error);
    return NextResponse.json({ error: 'Failed to update validador' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await validadorService.deleteValidador(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting validador:', error);
    return NextResponse.json({ error: 'Failed to delete validador' }, { status: 500 });
  }
}