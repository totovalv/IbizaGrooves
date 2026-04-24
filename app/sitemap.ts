import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ibizagrooves.com';

  try {
    const [artists, mixes, newsletter] = await Promise.all([
      prisma.artist.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.mix.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.newsletterEntry.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/artists`, lastModified: new Date() },
      { url: `${base}/mixes`, lastModified: new Date() },
      { url: `${base}/merch`, lastModified: new Date() },
      ...artists.map((a: { slug: string; updatedAt: Date }) => ({ url: `${base}/artists/${a.slug}`, lastModified: a.updatedAt })),
      ...mixes.map((m: { slug: string; updatedAt: Date }) => ({ url: `${base}/mixes/${m.slug}`, lastModified: m.updatedAt })),
      ...newsletter.map((e: { slug: string; updatedAt: Date }) => ({ url: `${base}/newsletter/${e.slug}`, lastModified: e.updatedAt })),
    ];
  } catch {
    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/artists`, lastModified: new Date() },
      { url: `${base}/mixes`, lastModified: new Date() },
      { url: `${base}/merch`, lastModified: new Date() },
    ];
  }
}
