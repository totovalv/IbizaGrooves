import NewsletterCard, { type NewsletterEntry } from './NewsletterCard';

interface NewsletterSectionProps {
  entries: NewsletterEntry[];
}

export default function NewsletterSection({ entries }: NewsletterSectionProps) {
  return (
    <section aria-label="Newsletter">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 leading-none mb-6">
            The Ibiza <span className="text-orange-500 underline decoration-8 underline-offset-[10px]">Journal</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Exclusive stories, hidden spots, and the latest from the island.
          </p>
        </div>
        <button className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:scale-105 transition-all shadow-2xl">
          Subscribe Now
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-300 font-bold uppercase tracking-widest text-center py-12">No entries yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
          {entries.map((entry) => (
            <NewsletterCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}

