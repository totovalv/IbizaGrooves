export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: 'Events | IbizaGrooves',
    description: 'Upcoming IbizaGrooves events — coming soon.',
    openGraph: {
      title: 'Events | IbizaGrooves',
      description: 'Upcoming IbizaGrooves events — coming soon.',
      images: [{ url: '/og/events.jpg' }],
    },
  };
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Events</h1>
        <p className="text-gray-400">Coming soon — stay tuned for upcoming IbizaGrooves events.</p>
      </div>
    </main>
  );
}
