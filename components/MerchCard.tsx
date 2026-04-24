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
    <article className="group cursor-pointer">
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm group-hover:shadow-2xl group-hover:border-orange-500/10 transition-all duration-500">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full font-black text-sm shadow-xl z-10">
            {formattedPrice}
          </div>
        </div>
        <div className="p-8 flex flex-col gap-3">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-50 rounded-full px-4 py-1.5 w-fit">
            {CATEGORY_LABELS[item.category]}
          </span>
          <h3 className="text-gray-900 font-black text-2xl uppercase italic tracking-tighter leading-none group-hover:text-orange-500 transition-colors">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

