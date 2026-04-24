import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const entries = await prisma.newsletterEntry.findMany({
      where: { publishedAt: { not: null } },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
