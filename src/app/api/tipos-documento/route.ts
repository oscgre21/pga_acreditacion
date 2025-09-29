import { NextRequest, NextResponse } from 'next/server';
import { tipoDocumentoService } from '@/lib/services/tipo-documento.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const tipos = await tipoDocumentoService.getAllTiposDocumento(includeInactive);
    return NextResponse.json(tipos);
  } catch (error) {
    console.error('Error fetching tipos de documento:', error);
    return NextResponse.json({ error: 'Failed to fetch tipos de documento' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const tipo = await tipoDocumentoService.createTipoDocumento(data);
    return NextResponse.json(tipo);
  } catch (error) {
    console.error('Error creating tipo de documento:', error);
    return NextResponse.json({ error: 'Failed to create tipo de documento' }, { status: 500 });
  }
}