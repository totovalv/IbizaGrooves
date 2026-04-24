import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import MerchCard from '@/components/MerchCard';
import type { MerchItem } from '@/components/MerchCard';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Merch | IbizaGrooves',
    description: 'Shop official IbizaGrooves merchandise — T-shirts, caps, hoodies, stickers, and more.',
    openGraph: {
      title: 'Merch | IbizaGrooves',
      description: 'Shop official IbizaGrooves merchandise — T-shirts, caps, hoodies, stickers, and more.',
      images: [{ url: '/og/merch.jpg' }],
    },
  };
}

async function getMerchItems(): Promise<MerchItem[]> {
  try {
    const items = await prisma.merchItem.findMany({
      where: { inStock: true },
      orderBy: { order: 'asc' },
    });
    return items.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  } catch {
    return [];
  }
}

export default async function MerchPage() {
  const items = await getMerchItems();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Merch</h1>
        </header>
        {items.length === 0 ? (
          <p className="text-gray-400">No merchandise available at the moment. Check back soon.</p>
        ) : (
          <section aria-label="Merchandise items">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
