import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const mix = await prisma.mix.findUnique({
      where: { slug: params.slug },
      include: { artist: true },
    });
    if (!mix) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(mix);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
