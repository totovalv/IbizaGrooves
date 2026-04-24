// Feature: ibiza-grooves-web-app, Property 11: Sitemap covers all dynamic slugs
// Validates: Requirements 8.2

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Mock Prisma at top level — hoisted before any imports
vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: { findMany: vi.fn() },
    mix: { findMany: vi.fn() },
    newsletterEntry: { findMany: vi.fn() },
  },
}));

import { prisma } from '@/lib/prisma';
import sitemap from '@/app/sitemap';

const BASE = 'https://ibizagrooves.com';
const STATIC_URLS = [BASE, `${BASE}/artists`, `${BASE}/mixes`, `${BASE}/merch`];

describe('Property 11: Sitemap covers all dynamic slugs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sitemap includes all static pages when DB returns empty arrays', async () => {
    vi.mocked(prisma.artist.findMany).mockResolvedValue([]);
    vi.mocked(prisma.mix.findMany).mockResolvedValue([]);
    vi.mocked(prisma.newsletterEntry.findMany).mockResolvedValue([]);

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    for (const staticUrl of STATIC_URLS) {
      expect(urls).toContain(staticUrl);
    }
  });

  it('sitemap includes one entry per artist, mix, and newsletter slug (property)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({ slug: fc.string({ minLength: 1 }), updatedAt: fc.date() })),
        fc.array(fc.record({ slug: fc.string({ minLength: 1 }), updatedAt: fc.date() })),
        fc.array(fc.record({ slug: fc.string({ minLength: 1 }), updatedAt: fc.date() })),
        async (artists, mixes, newsletter) => {
          vi.mocked(prisma.artist.findMany).mockResolvedValue(artists as never);
          vi.mocked(prisma.mix.findMany).mockResolvedValue(mixes as never);
          vi.mocked(prisma.newsletterEntry.findMany).mockResolvedValue(newsletter as never);

          const entries = await sitemap();
          const urls = entries.map((e) => e.url);

          // All static pages present
          for (const staticUrl of STATIC_URLS) {
            expect(urls).toContain(staticUrl);
          }

          // One entry per artist slug
          for (const artist of artists) {
            expect(urls).toContain(`${BASE}/artists/${artist.slug}`);
          }

          // One entry per mix slug
          for (const mix of mixes) {
            expect(urls).toContain(`${BASE}/mixes/${mix.slug}`);
          }

          // One entry per newsletter slug
          for (const entry of newsletter) {
            expect(urls).toContain(`${BASE}/newsletter/${entry.slug}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sitemap falls back to static pages only when DB throws', async () => {
    vi.mocked(prisma.artist.findMany).mockRejectedValue(new Error('DB error'));
    vi.mocked(prisma.mix.findMany).mockRejectedValue(new Error('DB error'));
    vi.mocked(prisma.newsletterEntry.findMany).mockRejectedValue(new Error('DB error'));

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toEqual(STATIC_URLS);
  });
});
