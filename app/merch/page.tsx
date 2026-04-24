import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import MerchCard from '@/components/MerchCard';
import type { MerchItem } from '@/components/MerchCard';

// Local interface for database response to avoid Prisma generation issues
interface DbMerchItem {
  id: string;
  name: string;
  slug: string;
  category: any;
  description: string | null;
  imageUrl: string | null;
  price: any;
  currency: string;
  inStock: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}


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
    return items.map((item: DbMerchItem) => ({
      ...item,
      price: Number(item.price),
    })) as MerchItem[];


  } catch {
    return [];
  }
}

export default async function MerchPage() {
  const items = await getMerchItems();

  return (
    <main className="min-h-screen bg-[#fdfdfd] px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900">
            Official <span className="text-orange-500">Merch</span>
          </h1>
          <p className="text-gray-500 mt-4 font-bold uppercase tracking-widest text-sm">
            Wear the vibe. High quality Ibiza gear.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="glass p-20 rounded-[3rem] text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">
              No merchandise available at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <section aria-label="Merchandise items">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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

