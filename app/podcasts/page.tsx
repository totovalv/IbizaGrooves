export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: 'Podcasts | IbizaGrooves',
    description: 'IbizaGrooves podcast series — coming soon.',
    openGraph: {
      title: 'Podcasts | IbizaGrooves',
      description: 'IbizaGrooves podcast series — coming soon.',
      images: [{ url: '/og/podcasts.jpg' }],
    },
  };
}

export default function PodcastsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Podcasts</h1>
        <p className="text-gray-400">Coming soon — stay tuned for the IbizaGrooves podcast series.</p>
      </div>
    </main>
  );
}
