import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categorias = await prisma.categoriaPersonal.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias personal:', error);
    return NextResponse.json({ error: 'Failed to fetch categorias personal' }, { status: 500 });
  }
}