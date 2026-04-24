import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const entry = await prisma.newsletterEntry.findUnique({ where: { slug: params.slug } });
    if (!entry) {
      return {
        title: 'Not Found | IbizaGrooves',
        description: 'This newsletter entry could not be found.',
        openGraph: {
          title: 'Not Found | IbizaGrooves',
          description: 'This newsletter entry could not be found.',
          images: [{ url: '/og/newsletter.jpg' }],
        },
      };
    }
    return {
      title: `${entry.title} | IbizaGrooves`,
      description: entry.summary ?? entry.title,
      openGraph: {
        title: `${entry.title} | IbizaGrooves`,
        description: entry.summary ?? entry.title,
        images: entry.coverImageUrl
          ? [{ url: entry.coverImageUrl }]
          : [{ url: '/og/newsletter.jpg' }],
      },
    };
  } catch {
    return {
      title: 'IbizaGrooves',
      description: 'IbizaGrooves — Live Radio, DJ Mixes & Ibiza Vibes.',
      openGraph: {
        title: 'IbizaGrooves',
        description: 'IbizaGrooves — Live Radio, DJ Mixes & Ibiza Vibes.',
        images: [{ url: '/og/newsletter.jpg' }],
      },
    };
  }
}

export default async function NewsletterEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  let entry;
  try {
    entry = await prisma.newsletterEntry.findUnique({ where: { slug: params.slug } });
  } catch {
    notFound();
  }
  if (!entry) notFound();

  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <article className="text-white">
          <header className="mb-8">
            <h1 className="text-4xl font-bold leading-tight mb-4">{entry.title}</h1>
            {entry.publishedAt && (
              <time
                dateTime={entry.publishedAt.toISOString()}
                className="text-gray-400 text-sm"
              >
                {entry.publishedAt.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </header>

          {entry.summary && (
            <p className="text-gray-300 text-lg mb-8 leading-relaxed border-l-4 border-orange-500 pl-4">
              {entry.summary}
            </p>
          )}

          <div className="prose prose-invert prose-orange max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>
        </article>
      </div>
    </main>
  );
}
