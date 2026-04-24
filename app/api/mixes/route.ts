import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mixes = await prisma.mix.findMany({
      where: { publishedAt: { not: null } },
      include: { artist: true },
    });
    return NextResponse.json(mixes);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
