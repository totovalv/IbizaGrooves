/**
 * Feature: ibiza-grooves-web-app
 * Property 1: Newsletter section renders all entries
 * Validates: Requirements 1.3
 */
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import NewsletterSection from './NewsletterSection';
import type { NewsletterEntry } from './NewsletterCard';

// next/link needs a router — provide a minimal mock
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const entryArbitrary = fc.record({
  id: fc.string(),
  title: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  summary: fc.option(fc.string()),
  // required by the interface but not rendered in the section itself
  content: fc.constant(''),
  coverImageUrl: fc.constant(null),
  publishedAt: fc.constant(null),
  createdAt: fc.constant(new Date(0)),
  updatedAt: fc.constant(new Date(0)),
}) as fc.Arbitrary<NewsletterEntry>;

describe('NewsletterSection — Property 1: renders all entries', () => {
  it('renders at least one clickable element per entry', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.array(entryArbitrary, { minLength: 1, maxLength: 10 }),
        (entries) => {
          const { unmount } = render(<NewsletterSection entries={entries} />);

          // Each card renders a "Read more →" link — one per entry
          const links = screen.getAllByRole('link');
          expect(links.length).toBeGreaterThanOrEqual(entries.length);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
