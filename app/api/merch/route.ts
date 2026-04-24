import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.merchItem.findMany({
      where: { inStock: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
