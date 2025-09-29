import { NextRequest, NextResponse } from 'next/server';
import { personaEspecificaService } from '@/lib/services/personaEspecifica.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const personas = await personaEspecificaService.getAllPersonasEspecificas(includeInactive);
    return NextResponse.json(personas);
  } catch (error) {
    console.error('Error fetching personas especificas:', error);
    return NextResponse.json({ error: 'Failed to fetch personas especificas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const persona = await personaEspecificaService.createPersonaEspecifica(data);
    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error creating persona especifica:', error);
    return NextResponse.json({ error: 'Failed to create persona especifica' }, { status: 500 });
  }
}