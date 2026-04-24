import { PrismaClient, MerchCategory } from '@prisma/client';

const prisma = new PrismaClient();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const artists = [
  { name: 'Serafin' },
  { name: 'Happy Samurai' },
  { name: 'Tim Angrave' },
  { name: 'Al Luckett' },
  { name: 'Marta DLM' },
  { name: 'Enoch The Musical Blacksmith' },
  { name: 'JPTR (Jupiter)' },
  { name: 'Manolo Estevez' },
];

const merch: { name: string; category: MerchCategory; price: number }[] = [
  { name: 'IbizaGrooves T-Shirt', category: MerchCategory.TSHIRT, price: 25.00 },
  { name: 'IbizaGrooves Cap', category: MerchCategory.CAP, price: 20.00 },
  { name: 'IbizaGrooves Hoodie', category: MerchCategory.HOODIE, price: 45.00 },
  { name: 'IbizaGrooves Sticker', category: MerchCategory.STICKER, price: 5.00 },
  { name: 'IbizaGrooves Keyhanger', category: MerchCategory.KEYHANGER, price: 8.00 },
];

async function main() {
  console.log('Seeding artists...');
  for (let i = 0; i < artists.length; i++) {
    const { name } = artists[i];
    const slug = toSlug(name);
    await prisma.artist.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        photoUrl: '/images/artists/placeholder.jpg',
        order: i,
      },
    });
    console.log(`  Upserted artist: ${name}`);
  }

  console.log('Seeding radio stream...');
  const streamUrl =
    process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? 'https://stream.ibizagrooves.com/live';
  // Use upsert-by-name pattern since RadioStream has no unique slug
  const existing = await prisma.radioStream.findFirst({ where: { name: 'IbizaGrooves Radio' } });
  if (existing) {
    await prisma.radioStream.update({
      where: { id: existing.id },
      data: { streamUrl, isActive: true },
    });
  } else {
    await prisma.radioStream.create({
      data: {
        name: 'IbizaGrooves Radio',
        streamUrl,
        isActive: true,
      },
    });
  }
  console.log(`  Radio stream: ${streamUrl}`);

  console.log('Seeding merch items...');
  for (let i = 0; i < merch.length; i++) {
    const { name, category, price } = merch[i];
    const slug = toSlug(name);
    await prisma.merchItem.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        category,
        imageUrl: '/images/merch/placeholder.jpg',
        price,
        order: i,
      },
    });
    console.log(`  Upserted merch: ${name} (${category}) @ €${price}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
