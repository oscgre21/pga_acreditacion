import { NextRequest, NextResponse } from 'next/server';
import { perfilEmpresaService } from '@/lib/services/perfilEmpresa.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const perfil = await perfilEmpresaService.getPerfilEmpresaById(params.id);
    if (!perfil) {
      return NextResponse.json({ error: 'Perfil empresa not found' }, { status: 404 });
    }
    return NextResponse.json(perfil);
  } catch (error) {
    console.error('Error fetching perfil empresa:', error);
    return NextResponse.json({ error: 'Failed to fetch perfil empresa' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const perfil = await perfilEmpresaService.updatePerfilEmpresa(params.id, data);
    return NextResponse.json(perfil);
  } catch (error) {
    console.error('Error updating perfil empresa:', error);
    return NextResponse.json({ error: 'Failed to update perfil empresa' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await perfilEmpresaService.deletePerfilEmpresa(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting perfil empresa:', error);
    return NextResponse.json({ error: 'Failed to delete perfil empresa' }, { status: 500 });
  }
}