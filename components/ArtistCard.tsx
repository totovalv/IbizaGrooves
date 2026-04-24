import Image from 'next/image';

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  photoUrl?: string | null;
  pressskitUrl?: string | null;
  pressskitContent?: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const photoSrc = artist.photoUrl ?? '/images/artists/placeholder.jpg';

  return (
    <article className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-orange-500/20 transition-shadow">
      <div className="relative w-full aspect-square">
        <Image
          src={photoSrc}
          alt={artist.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg leading-snug">{artist.name}</h3>
        {artist.bio && (
          <p className="text-gray-400 text-sm line-clamp-3">{artist.bio}</p>
        )}
        {artist.pressskitContent && (
          <div className="mt-2 text-gray-300 text-sm">
            <p className="font-semibold text-orange-400 mb-1">Press Kit</p>
            <p className="line-clamp-4">{artist.pressskitContent}</p>
          </div>
        )}
      </div>
    </article>
  );
}
