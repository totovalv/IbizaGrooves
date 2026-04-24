/**
 * Feature: ibiza-grooves-web-app
 * Property 8: Merch card renders name, image, and price
 * Validates: Requirements 6.2
 */
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import MerchCard from './MerchCard';
import type { MerchItem } from './MerchCard';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @next/next/no-img-element
  default: ({ fill: _fill, ...props }: { fill?: boolean; [key: string]: unknown }) => <img {...props} alt="" />,
}));

const baseItem: Omit<MerchItem, 'name' | 'imageUrl' | 'price'> = {
  id: 'test-id',
  slug: 'test-slug',
  category: 'TSHIRT',
  description: null,
  currency: 'EUR',
  inStock: true,
  order: 0,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

describe('MerchCard — Property 8: renders name, image, and price', () => {
  it('renders item name as text, an img element, and the formatted price', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          imageUrl: fc.option(fc.webUrl()),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(9999) }),
        }),
        ({ name, imageUrl, price }) => {
          const item: MerchItem = {
            ...baseItem,
            name,
            imageUrl: imageUrl ?? null,
            price,
          };

          const { unmount } = render(<MerchCard item={item} />);

          // Name is rendered in the heading
          const heading = screen.getByRole('heading');
          expect(heading.textContent).toBe(name);

          // An img element is present
          const img = document.querySelector('img');
          expect(img).not.toBeNull();

          // Formatted price is rendered
          const formattedPrice = new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: item.currency,
          }).format(price);
          expect(document.body.textContent).toContain(formattedPrice);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
