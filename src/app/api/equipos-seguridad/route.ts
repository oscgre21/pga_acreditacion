import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const equipos = await prisma.equipoSeguridad.findMany({
      where: { estado: 'ACTIVO' },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(equipos);
  } catch (error) {
    console.error('Error fetching equipos seguridad:', error);
    return NextResponse.json({ error: 'Failed to fetch equipos seguridad' }, { status: 500 });
  }
}