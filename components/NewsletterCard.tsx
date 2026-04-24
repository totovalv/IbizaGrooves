import Link from 'next/link';

export interface NewsletterEntry {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  publishedAt?: Date | null;
}

interface NewsletterCardProps {
  entry: NewsletterEntry;
}

export default function NewsletterCard({ entry }: NewsletterCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 p-8 shadow-sm group-hover:shadow-xl group-hover:border-orange-500/20 transition-all duration-500 min-h-[280px] flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          News Update
        </p>
        
        <h3 className="text-gray-900 font-black text-3xl uppercase italic tracking-tighter leading-[0.9] mb-4 group-hover:text-orange-500 transition-colors">
          {entry.title}
        </h3>

        {entry.summary && (
          <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
            {entry.summary}
          </p>
        )}

        <Link
          href={`/newsletter/${entry.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:gap-4 transition-all"
        >
          Read Full Story <span className="text-orange-500 text-lg">→</span>
        </Link>
      </div>
    </article>
  );
}

