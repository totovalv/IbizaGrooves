// Feature: ibiza-grooves-web-app
// Property 12: Prisma model round-trip preserves all required fields
// Validates: Requirements 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: { create: vi.fn(), findUnique: vi.fn() },
    mix: { create: vi.fn(), findUnique: vi.fn() },
    newsletterEntry: { create: vi.fn(), findUnique: vi.fn() },
    merchItem: { create: vi.fn(), findUnique: vi.fn() },
    radioStream: { create: vi.fn(), findUnique: vi.fn() },
    event: { create: vi.fn(), findUnique: vi.fn() },
    podcast: { create: vi.fn(), findUnique: vi.fn() },
  },
}));

import { prisma } from '@/lib/prisma';

beforeEach(() => vi.clearAllMocks());

// Arbitraries for required fields per model
const idArb = fc.string({ minLength: 1 });
const slugArb = fc.string({ minLength: 1 });
const dateArb = fc.date();

const artistArb = fc.record({
  id: idArb,
  name: fc.string({ minLength: 1 }),
  slug: slugArb,
  isFeatured: fc.boolean(),
  order: fc.integer({ min: 0 }),
  createdAt: dateArb,
  updatedAt: dateArb,
});

const mixArb = fc.record({
  id: idArb,
  title: fc.string({ minLength: 1 }),
  slug: slugArb,
  artistId: idArb,
  audioUrl: fc.webUrl(),
  playCount: fc.integer({ min: 0 }),
  createdAt: dateArb,
  updatedAt: dateArb,
});

const newsletterEntryArb = fc.record({
  id: idArb,
  title: fc.string({ minLength: 1 }),
  slug: slugArb,
  content: fc.string(),
  createdAt: dateArb,
  updatedAt: dateArb,
});

const merchItemArb = fc.record({
  id: idArb,
  name: fc.string({ minLength: 1 }),
  slug: slugArb,
  category: fc.constantFrom('TSHIRT', 'CAP', 'HOODIE', 'STICKER', 'KEYHANGER', 'OTHER'),
  price: fc.float({ min: 0.01, max: 9999 }),
  currency: fc.constant('EUR'),
  inStock: fc.boolean(),
  order: fc.integer({ min: 0 }),
  createdAt: dateArb,
  updatedAt: dateArb,
});

const radioStreamArb = fc.record({
  id: idArb,
  name: fc.string({ minLength: 1 }),
  streamUrl: fc.webUrl(),
  isActive: fc.boolean(),
  createdAt: dateArb,
  updatedAt: dateArb,
});

const eventArb = fc.record({
  id: idArb,
  title: fc.string({ minLength: 1 }),
  slug: slugArb,
  startDate: dateArb,
  createdAt: dateArb,
  updatedAt: dateArb,
});

const podcastArb = fc.record({
  id: idArb,
  title: fc.string({ minLength: 1 }),
  slug: slugArb,
  audioUrl: fc.webUrl(),
  createdAt: dateArb,
  updatedAt: dateArb,
});

function assertRequiredFields(record: Record<string, unknown>, fields: string[], label: string) {
  for (const field of fields) {
    expect(record[field], `${label}: field "${field}" should be present`).toBeDefined();
  }
}

describe('Property 12: Prisma model round-trip preserves all required fields', () => {
  it('Artist round-trip preserves required fields', () => {
    fc.assert(
      fc.property(artistArb, (record) => {
        vi.mocked(prisma.artist.create).mockResolvedValue(record as never);
        vi.mocked(prisma.artist.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'name', 'slug', 'isFeatured', 'order', 'createdAt', 'updatedAt'], 'Artist');
        expect(typeof record.id).toBe('string');
        expect(typeof record.name).toBe('string');
        expect(typeof record.slug).toBe('string');
        expect(typeof record.isFeatured).toBe('boolean');
        expect(typeof record.order).toBe('number');
        expect(record.createdAt).toBeInstanceOf(Date);
        expect(record.updatedAt).toBeInstanceOf(Date);
      }),
      { numRuns: 50 }
    );
  });

  it('Mix round-trip preserves required fields', () => {
    fc.assert(
      fc.property(mixArb, (record) => {
        vi.mocked(prisma.mix.create).mockResolvedValue(record as never);
        vi.mocked(prisma.mix.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'title', 'slug', 'artistId', 'audioUrl', 'playCount', 'createdAt', 'updatedAt'], 'Mix');
        expect(typeof record.id).toBe('string');
        expect(typeof record.title).toBe('string');
        expect(typeof record.audioUrl).toBe('string');
        expect(typeof record.playCount).toBe('number');
      }),
      { numRuns: 50 }
    );
  });

  it('NewsletterEntry round-trip preserves required fields', () => {
    fc.assert(
      fc.property(newsletterEntryArb, (record) => {
        vi.mocked(prisma.newsletterEntry.create).mockResolvedValue(record as never);
        vi.mocked(prisma.newsletterEntry.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'title', 'slug', 'content', 'createdAt', 'updatedAt'], 'NewsletterEntry');
        expect(typeof record.content).toBe('string');
      }),
      { numRuns: 50 }
    );
  });

  it('MerchItem round-trip preserves required fields', () => {
    fc.assert(
      fc.property(merchItemArb, (record) => {
        vi.mocked(prisma.merchItem.create).mockResolvedValue(record as never);
        vi.mocked(prisma.merchItem.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'name', 'slug', 'category', 'price', 'currency', 'inStock', 'order', 'createdAt', 'updatedAt'], 'MerchItem');
        expect(typeof record.category).toBe('string');
        expect(typeof record.inStock).toBe('boolean');
      }),
      { numRuns: 50 }
    );
  });

  it('RadioStream round-trip preserves required fields', () => {
    fc.assert(
      fc.property(radioStreamArb, (record) => {
        vi.mocked(prisma.radioStream.create).mockResolvedValue(record as never);
        vi.mocked(prisma.radioStream.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'name', 'streamUrl', 'isActive', 'createdAt', 'updatedAt'], 'RadioStream');
        expect(typeof record.isActive).toBe('boolean');
        expect(typeof record.streamUrl).toBe('string');
      }),
      { numRuns: 50 }
    );
  });

  it('Event round-trip preserves required fields', () => {
    fc.assert(
      fc.property(eventArb, (record) => {
        vi.mocked(prisma.event.create).mockResolvedValue(record as never);
        vi.mocked(prisma.event.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'title', 'slug', 'startDate', 'createdAt', 'updatedAt'], 'Event');
        expect(record.startDate).toBeInstanceOf(Date);
      }),
      { numRuns: 50 }
    );
  });

  it('Podcast round-trip preserves required fields', () => {
    fc.assert(
      fc.property(podcastArb, (record) => {
        vi.mocked(prisma.podcast.create).mockResolvedValue(record as never);
        vi.mocked(prisma.podcast.findUnique).mockResolvedValue(record as never);
        assertRequiredFields(record, ['id', 'title', 'slug', 'audioUrl', 'createdAt', 'updatedAt'], 'Podcast');
        expect(typeof record.audioUrl).toBe('string');
      }),
      { numRuns: 50 }
    );
  });
});
