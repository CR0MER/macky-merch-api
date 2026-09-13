import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const env = config({ path: '.env.test', override: true });
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
  });

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  await prisma.product.deleteMany();
  await prisma.$disconnect();
}
