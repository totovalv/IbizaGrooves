import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { slug: params.slug },
    });
    if (!artist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(artist);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
