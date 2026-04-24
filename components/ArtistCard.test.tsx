/**
 * Feature: ibiza-grooves-web-app
 * Property 6: Artist card renders name and image
 * Validates: Requirements 5.2
 *
 * Property 7: Artist presskit renders when present
 * Validates: Requirements 5.3
 */
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import ArtistCard from './ArtistCard';
import type { Artist } from './ArtistCard';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @next/next/no-img-element
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

describe('ArtistCard — Property 6: renders name and image', () => {
  it('renders artist name as text and an img element', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          photoUrl: fc.option(fc.webUrl()),
        }),
        ({ name, photoUrl }) => {
          const artist: Artist = {
            ...baseArtist,
            name,
            photoUrl: photoUrl ?? null,
          };

          const { unmount } = render(<ArtistCard artist={artist} />);

          // Name is rendered in the heading
          const heading = screen.getByRole('heading');
          expect(heading.textContent).toBe(name);

          // An img element is present
          const img = document.querySelector('img');
          expect(img).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('ArtistCard — Property 7: presskit renders when present', () => {
  it('renders pressskitContent when non-null and non-empty', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          pressskitContent: fc.string({ minLength: 1 }),
        }),
        ({ pressskitContent }) => {
          const artist: Artist = {
            ...baseArtist,
            name: 'Test Artist',
            photoUrl: null,
            pressskitContent,
          };

          const { unmount } = render(<ArtistCard artist={artist} />);

          // pressskitContent appears somewhere in the rendered output
          expect(document.body.textContent).toContain(pressskitContent);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
