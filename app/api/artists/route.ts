import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
