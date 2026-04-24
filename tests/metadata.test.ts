// Feature: ibiza-grooves-web-app, Property 10: Page metadata is complete
// Validates: Requirements 8.1, 8.4

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Mock Prisma before importing page modules
vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: { findMany: vi.fn() },
    mix: { findMany: vi.fn() },
    newsletterEntry: { findMany: vi.fn(), findUnique: vi.fn() },
    merchItem: { findMany: vi.fn() },
  },
}));

import { prisma } from '@/lib/prisma';

// Helper to assert metadata completeness
function assertMetadataComplete(metadata: Record<string, unknown>, label: string) {
  expect(typeof metadata.title, `${label}: title should be a string`).toBe('string');
  expect((metadata.title as string).length, `${label}: title should be non-empty`).toBeGreaterThan(0);

  expect(typeof metadata.description, `${label}: description should be a string`).toBe('string');
  expect((metadata.description as string).length, `${label}: description should be non-empty`).toBeGreaterThan(0);

  const og = metadata.openGraph as Record<string, unknown>;
  expect(og, `${label}: openGraph should be present`).toBeTruthy();

  expect(typeof og.title, `${label}: openGraph.title should be a string`).toBe('string');
  expect((og.title as string).length, `${label}: openGraph.title should be non-empty`).toBeGreaterThan(0);

  expect(typeof og.description, `${label}: openGraph.description should be a string`).toBe('string');
  expect((og.description as string).length, `${label}: openGraph.description should be non-empty`).toBeGreaterThan(0);

  const images = og.images as unknown[];
  expect(Array.isArray(images), `${label}: openGraph.images should be an array`).toBe(true);
  expect(images.length, `${label}: openGraph.images should be non-empty`).toBeGreaterThan(0);
}

describe('Property 10: Page metadata is complete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('homepage generateMetadata returns complete metadata', async () => {
    const { generateMetadata } = await import('@/app/page');
    const metadata = await generateMetadata();
    assertMetadataComplete(metadata as Record<string, unknown>, 'homepage');
  });

  it('artists page generateMetadata returns complete metadata', async () => {
    const { generateMetadata } = await import('@/app/artists/page');
    const metadata = await generateMetadata();
    assertMetadataComplete(metadata as Record<string, unknown>, 'artists');
  });

  it('mixes page generateMetadata returns complete metadata', async () => {
    const { generateMetadata } = await import('@/app/mixes/page');
    const metadata = await generateMetadata();
    assertMetadataComplete(metadata as Record<string, unknown>, 'mixes');
  });

  it('merch page generateMetadata returns complete metadata', async () => {
    const { generateMetadata } = await import('@/app/merch/page');
    const metadata = await generateMetadata();
    assertMetadataComplete(metadata as Record<string, unknown>, 'merch');
  });

  it('newsletter entry generateMetadata returns complete metadata for any slug (property)', async () => {
    const { generateMetadata } = await import('@/app/newsletter/[slug]/page');

    await fc.assert(
      fc.asyncProperty(
        fc.record({ slug: fc.string({ minLength: 1 }) }),
        async ({ slug }) => {
          vi.mocked(prisma.newsletterEntry.findUnique).mockResolvedValue({
            id: 'test-id',
            title: `Newsletter ${slug}`,
            slug,
            summary: `Summary for ${slug}`,
            content: 'Content',
            coverImageUrl: null,
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const metadata = await generateMetadata({ params: { slug } });
          assertMetadataComplete(metadata as Record<string, unknown>, `newsletter/${slug}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('newsletter entry generateMetadata returns complete metadata when entry not found', async () => {
    const { generateMetadata } = await import('@/app/newsletter/[slug]/page');

    vi.mocked(prisma.newsletterEntry.findUnique).mockResolvedValue(null);
    const metadata = await generateMetadata({ params: { slug: 'missing-slug' } });
    assertMetadataComplete(metadata as Record<string, unknown>, 'newsletter/not-found');
  });

  it('newsletter entry generateMetadata returns complete metadata on DB error', async () => {
    const { generateMetadata } = await import('@/app/newsletter/[slug]/page');

    vi.mocked(prisma.newsletterEntry.findUnique).mockRejectedValue(new Error('DB error'));
    const metadata = await generateMetadata({ params: { slug: 'error-slug' } });
    assertMetadataComplete(metadata as Record<string, unknown>, 'newsletter/db-error');
  });
});
