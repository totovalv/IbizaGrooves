// Feature: ibiza-grooves-web-app, Property 5: Mix navigation respects list boundaries
// Validates: Requirements 3.4
// Feature: ibiza-grooves-web-app, Property 4: Mix list renders title and artist name
// Validates: Requirements 3.1

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { clampIndex } from './MixPlayer';
import MixPlayer from './MixPlayer';

vi.mock('@/lib/audio-controller', () => ({
  useAudioController: () => ({
    activePlayer: null,
    currentMixId: null,
    playMix: vi.fn(),
    pause: vi.fn(),
  }),
}));

describe('clampIndex', () => {
  it('returns 0 for an empty list', () => {
    expect(clampIndex(0, 1, 0)).toBe(0);
    expect(clampIndex(0, -1, 0)).toBe(0);
  });

  it('advances forward within bounds', () => {
    expect(clampIndex(0, 1, 3)).toBe(1);
    expect(clampIndex(1, 1, 3)).toBe(2);
  });

  it('stays at last index when calling next at the end', () => {
    expect(clampIndex(2, 1, 3)).toBe(2);
  });

  it('stays at 0 when calling prev at the start', () => {
    expect(clampIndex(0, -1, 3)).toBe(0);
  });

  /**
   * Property 5: Mix navigation respects list boundaries
   * Validates: Requirements 3.4
   *
   * For any non-empty list of mixes and a valid current index:
   * - nextMix() at the last index stays at the last index (no wrap)
   * - prevMix() at index 0 stays at 0 (no wrap)
   */
  it('Property 5: nextMix at last index stays at last; prevMix at index 0 stays at 0', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
          }),
          { minLength: 1 }
        ),
        fc.nat(),
        (mixes, rawIndex) => {
          const length = mixes.length;
          const lastIndex = length - 1;

          // nextMix at last index must stay at last index
          expect(clampIndex(lastIndex, 1, length)).toBe(lastIndex);

          // prevMix at index 0 must stay at 0
          expect(clampIndex(0, -1, length)).toBe(0);

          // For any valid current index, result is always within [0, lastIndex]
          const current = rawIndex % length;
          const afterNext = clampIndex(current, 1, length);
          const afterPrev = clampIndex(current, -1, length);

          expect(afterNext).toBeGreaterThanOrEqual(0);
          expect(afterNext).toBeLessThanOrEqual(lastIndex);
          expect(afterPrev).toBeGreaterThanOrEqual(0);
          expect(afterPrev).toBeLessThanOrEqual(lastIndex);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('MixPlayer — Property 4: Mix list renders title and artist name', () => {
  /**
   * Property 4: Mix list renders title and artist name
   * Validates: Requirements 3.1
   *
   * For any non-empty array of Mix objects (each with an associated artist name),
   * the MixPlayer component should render each mix's title and artist name in the output.
   */
  it('Property 4: renders each mix title and artist name', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            title: fc.string({ minLength: 1 }),
            artist: fc.record({ name: fc.string({ minLength: 1 }) }),
          }),
          { minLength: 1 }
        ),
        (mixes) => {
          // Build full Mix objects with required fields
          const fullMixes = mixes.map((m) => ({
            ...m,
            slug: m.id,
            artistId: m.id,
            audioUrl: 'https://example.com/mix.mp3',
            playCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          const { container, unmount } = render(<MixPlayer mixes={fullMixes} />);
          const textContent = container.textContent ?? '';

          for (const mix of mixes) {
            // Title should appear in the rendered text
            expect(textContent).toContain(mix.title);
            // Artist name should appear in the rendered text
            expect(textContent).toContain(mix.artist.name);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
