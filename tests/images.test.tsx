/**
 * Feature: ibiza-grooves-web-app
 * Property 9: Content images include responsive srcset
 * Validates: Requirements 7.3
 */
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import ArtistCard from '@/components/ArtistCard';
import MerchCard from '@/components/MerchCard';
import type { Artist } from '@/components/ArtistCard';
import type { MerchItem } from '@/components/MerchCard';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill: _fill, ...props }: { fill?: boolean; [key: string]: unknown }) => <img {...props} alt="" />,
}));

const baseArtist: Omit<Artist, 'name' | 'photoUrl'> = {
  id: 'test-id',
  slug: 'test-slug',
  bio: null,
  pressskitUrl: null,
  pressskitContent: null,
  isFeatured: false,
  order: 0,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

const baseMerchItem: Omit<MerchItem, 'name' | 'imageUrl'> = {
  id: 'merch-id',
  slug: 'merch-slug',
  category: 'TSHIRT',
  description: null,
  price: 25,
  currency: 'EUR',
  inStock: true,
  order: 0,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

describe('Property 9: Content images include responsive srcset', () => {
  it('ArtistCard passes sizes prop to next/image', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          photoUrl: fc.webUrl(),
        }),
        ({ name, photoUrl }) => {
          const artist: Artist = { ...baseArtist, name, photoUrl };
          const { unmount } = render(<ArtistCard artist={artist} />);

          const img = document.querySelector('img');
          expect(img).not.toBeNull();
          expect(img!.getAttribute('sizes')).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('MerchCard passes sizes prop to next/image', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          photoUrl: fc.webUrl(),
        }),
        ({ name, photoUrl }) => {
          const item: MerchItem = { ...baseMerchItem, name, imageUrl: photoUrl };
          const { unmount } = render(<MerchCard item={item} />);

          const img = document.querySelector('img');
          expect(img).not.toBeNull();
          expect(img!.getAttribute('sizes')).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
