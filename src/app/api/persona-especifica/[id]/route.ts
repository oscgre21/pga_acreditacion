import { NextRequest, NextResponse } from 'next/server';
import { personaEspecificaService } from '@/lib/services/personaEspecifica.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const persona = await personaEspecificaService.getPersonaEspecificaById(params.id);
    if (!persona) {
      return NextResponse.json({ error: 'Persona especifica not found' }, { status: 404 });
    }
    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error fetching persona especifica:', error);
    return NextResponse.json({ error: 'Failed to fetch persona especifica' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const persona = await personaEspecificaService.updatePersonaEspecifica(params.id, data);
    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error updating persona especifica:', error);
    return NextResponse.json({ error: 'Failed to update persona especifica' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await personaEspecificaService.deletePersonaEspecifica(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting persona especifica:', error);
    return NextResponse.json({ error: 'Failed to delete persona especifica' }, { status: 500 });
  }
}