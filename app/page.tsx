import nextDynamic from 'next/dynamic';
import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import NewsletterSection from '@/components/NewsletterSection';
import type { NewsletterEntry } from '@/components/NewsletterCard';
import type { Mix } from '@/components/MixPlayer';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

const MixPlayer = nextDynamic(() => import('@/components/MixPlayer'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'IbizaGrooves — Live Radio, DJ Mixes & Ibiza Vibes',
    description:
      'IbizaGrooves is your home for live Ibiza radio, curated DJ mixes, artist profiles, and exclusive merchandise from the heart of the island.',
  };
}

// Mock data for new sections
const MOCK_ARTISTS = [
  { name: 'Luciano', genre: 'Minimal Techno', image: '/artists/luciano.png' },
  { name: 'Nicole Moudaber', genre: 'Techno', image: '/artists/nicole.png' },
  { name: 'Sven Väth', genre: 'Techno', image: '/artists/sven.png' },
  { name: 'Black Coffee', genre: 'Afro House', image: '/artists/blackcoffee.png' },
];


const MOCK_MERCH = [
  { name: 'Sunrise Tee', price: '€35', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=500&fit=crop' },
  { name: 'Vinyl Cap', price: '€25', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop' },
  { name: 'Groove Hoodie', price: '€65', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop' },
];

export default async function HomePage() {
  const newsletterEntries: NewsletterEntry[] = [
    { id: '1', title: 'The Summer Opening', summary: 'Everything you need to know about the 2024 opening parties.', publishedAt: new Date() },
    { id: '2', title: 'Top 10 Sunset Spots', summary: 'Hidden gems for the best sunset views in Ibiza.', publishedAt: new Date() },
  ];

  const mockedMixes: Mix[] = [
    { id: '1', title: 'Sunset Session 01', artist: { name: 'DJ Piti' }, audioUrl: '', playCount: 1200, createdAt: new Date(), updatedAt: new Date(), slug: 'sunset-01', artistId: '1' },
    { id: '2', title: 'Midnight Grooves', artist: { name: 'Solomun' }, audioUrl: '', playCount: 5400, createdAt: new Date(), updatedAt: new Date(), slug: 'midnight-01', artistId: '2' },
  ];

  return (
    <div className="space-y-32 pb-32 bg-[#fdfdfd]">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {/* Featured Artists */}
        <section aria-label="Featured Artists">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
                Featured <span className="text-orange-500">Artists</span>
              </h2>
              <p className="text-gray-500 mt-2 font-medium">The heartbeat of the Ibiza scene.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-black transition-colors">
              Explore All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {MOCK_ARTISTS.map((artist) => (
              <div key={artist.name} className="group cursor-pointer">
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-all duration-500" />
                </div>

                <h3 className="font-black uppercase italic tracking-tighter text-xl">{artist.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{artist.genre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mixes Section */}
        <section aria-label="DJ Mixes">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
                Latest <span className="text-orange-500">DJ Mixes</span>
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Curated sounds from the world's best DJs.</p>
            </div>
          </div>
          <div className="glass p-2 rounded-[3rem]">
            <MixPlayer mixes={mockedMixes} />
          </div>
        </section>

        {/* Merch Section */}
        <section aria-label="Merchandise">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
                Official <span className="text-orange-500">Merch</span>
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Wear the vibe. High quality Ibiza gear.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-black transition-colors">
              Visit Shop →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MOCK_MERCH.map((item) => (
              <div key={item.name} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full font-black text-sm shadow-xl">
                    {item.price}
                  </div>
                </div>
                <h3 className="font-black uppercase italic tracking-tighter text-2xl">{item.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative overflow-hidden rounded-[3rem] bg-orange-50 p-8 md:p-20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-200 blur-[100px] rounded-full opacity-50" />
          <NewsletterSection entries={newsletterEntries} />
        </section>
      </div>
    </div>
  );
}


