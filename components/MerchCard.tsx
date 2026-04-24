import Image from 'next/image';

export interface MerchItem {
  id: string;
  name: string;
  slug: string;
  category: 'TSHIRT' | 'CAP' | 'HOODIE' | 'STICKER' | 'KEYHANGER' | 'OTHER';
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MerchCardProps {
  item: MerchItem;
}

const CATEGORY_LABELS: Record<MerchItem['category'], string> = {
  TSHIRT: 'T-Shirt',
  CAP: 'Cap',
  HOODIE: 'Hoodie',
  STICKER: 'Sticker',
  KEYHANGER: 'Key Hanger',
  OTHER: 'Other',
};

export default function MerchCard({ item }: MerchCardProps) {
  const imageSrc = item.imageUrl ?? '/images/merch/placeholder.jpg';

  const formattedPrice = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: item.currency,
  }).format(item.price);

  return (
    <article className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-orange-500/20 transition-shadow">
      <div className="relative w-full aspect-square">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-orange-400 bg-orange-400/10 rounded px-2 py-0.5 w-fit">
          {CATEGORY_LABELS[item.category]}
        </span>
        <h3 className="text-white font-bold text-lg leading-snug">{item.name}</h3>
        {item.description && (
          <p className="text-gray-400 text-sm line-clamp-3">{item.description}</p>
        )}
        <p className="text-orange-300 font-semibold text-base mt-1">{formattedPrice}</p>
      </div>
    </article>
  );
}
