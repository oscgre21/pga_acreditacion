import { NextRequest, NextResponse } from 'next/server';
import { perfilEmpresaService } from '@/lib/services/perfilEmpresa.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const perfiles = await perfilEmpresaService.getAllPerfilesEmpresa(includeInactive);
    return NextResponse.json(perfiles);
  } catch (error) {
    console.error('Error fetching perfil empresa:', error);
    return NextResponse.json({ error: 'Failed to fetch perfil empresa' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const perfil = await perfilEmpresaService.createPerfilEmpresa(data);
    return NextResponse.json(perfil);
  } catch (error) {
    console.error('Error creating perfil empresa:', error);
    return NextResponse.json({ error: 'Failed to create perfil empresa' }, { status: 500 });
  }
}