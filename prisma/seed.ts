import { PrismaClient } from '@prisma/client';
import reportsSeed from '../data/reports.seed.json' with { type: 'json' };

const prisma = new PrismaClient();

interface SeedReport {
  id: string;
  offerId: string;
  vote: 'WORKED' | 'DIDNT_WORK';
  comment?: string;
  anonId: string;
  createdAt: string;
}

async function main() {
  const seeds = reportsSeed as SeedReport[];
  console.log(`Seeding ${seeds.length} verification reports…`);

  for (const r of seeds) {
    await prisma.verificationReport.upsert({
      where: { offerId_anonId: { offerId: r.offerId, anonId: r.anonId } },
      update: {},
      create: {
        id: r.id,
        offerId: r.offerId,
        vote: r.vote,
        comment: r.comment,
        anonId: r.anonId,
        createdAt: new Date(r.createdAt),
      },
    });
  }

  const total = await prisma.verificationReport.count();
  console.log(`Done. ${total} reports in the database.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
