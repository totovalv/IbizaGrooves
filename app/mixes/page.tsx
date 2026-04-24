import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { prisma } from '@/lib/prisma';
import type { Mix } from '@/components/MixPlayer';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

const MixPlayer = nextDynamic(() => import('@/components/MixPlayer'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mixes | IbizaGrooves',
    description: 'Listen to the latest DJ mixes from the IbizaGrooves collective.',
    openGraph: {
      title: 'Mixes | IbizaGrooves',
      description: 'Listen to the latest DJ mixes from the IbizaGrooves collective.',
      images: [{ url: '/og/mixes.jpg' }],
    },
  };
}

async function getMixes(): Promise<Mix[]> {
  try {
    const mixes = await prisma.mix.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      include: { artist: true },
    });
    return mixes as Mix[];
  } catch {
    return [];
  }
}

export default async function MixesPage() {
  const mixes = await getMixes();

  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white">Mixes</h1>
        <p className="mt-2 text-gray-400">The latest DJ mixes from the IbizaGrooves collective</p>
      </header>

      <section className="max-w-3xl mx-auto">
        <MixPlayer mixes={mixes} />
      </section>
    </main>
  );
}
