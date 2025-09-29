import { NextRequest, NextResponse } from 'next/server';
import { companiaService } from '@/lib/services/compania.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const companias = await companiaService.getAllCompanias(includeInactive);
    return NextResponse.json(companias);
  } catch (error) {
    console.error('Error fetching companias:', error);
    return NextResponse.json({ error: 'Failed to fetch companias' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const compania = await companiaService.createCompania(data);
    return NextResponse.json(compania);
  } catch (error) {
    console.error('Error creating compania:', error);
    return NextResponse.json({ error: 'Failed to create compania' }, { status: 500 });
  }
}