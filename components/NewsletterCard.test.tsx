/**
 * Feature: ibiza-grooves-web-app
 * Property 2: Newsletter card links to correct slug
 * Validates: Requirements 1.4
 */
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import NewsletterCard from './NewsletterCard';
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
  content: fc.constant(''),
  coverImageUrl: fc.constant(null),
  publishedAt: fc.constant(null),
  createdAt: fc.constant(new Date(0)),
  updatedAt: fc.constant(new Date(0)),
}) as fc.Arbitrary<NewsletterEntry>;

describe('NewsletterCard — Property 2: href matches slug', () => {
  it('anchor href equals /newsletter/{slug}', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(entryArbitrary, (entry) => {
        const { unmount } = render(<NewsletterCard entry={entry} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', `/newsletter/${entry.slug}`);

        unmount();
      }),
      { numRuns: 50 }
    );
  });
});
