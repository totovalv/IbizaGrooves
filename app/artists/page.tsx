import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArtistCard from '@/components/ArtistCard';
import type { Artist } from '@/components/ArtistCard';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Artists | IbizaGrooves',
    description: "Meet the resident and featured artists of IbizaGrooves — Ibiza's premier DJ collective.",
    openGraph: {
      title: 'Artists | IbizaGrooves',
      description: "Meet the resident and featured artists of IbizaGrooves — Ibiza's premier DJ collective.",
      images: [{ url: '/og/artists.jpg' }],
    },
  };
}

async function getArtists(): Promise<Artist[]> {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { order: 'asc' },
    });
    return artists as Artist[];
  } catch {
    return [];
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white">Artists</h1>
        <p className="mt-2 text-gray-400">The resident and featured artists of IbizaGrooves</p>
      </header>

      {artists.length === 0 ? (
        <p className="text-center text-gray-500">No artists found.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </section>
      )}
    </main>
  );
}
