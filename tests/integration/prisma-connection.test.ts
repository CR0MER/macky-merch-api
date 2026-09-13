import { describe, it, expect, afterAll } from 'vitest';
import { prisma } from '../../src/config/prisma';

describe('Prisma test database', () => {
  it('connects to an empty products table', async () => {
    const count = await prisma.product.count();
    expect(count).toBe(0);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
