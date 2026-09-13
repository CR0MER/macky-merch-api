import { config } from 'dotenv';
import { execSync } from 'node:child_process';

export default async function globalSetup() {
  config({ path: '.env.test' });
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
  });
}
