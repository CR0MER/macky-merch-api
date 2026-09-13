import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/prisma';

const app = createApp();

beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      name: `Product ${i + 1}`,
      price: 10 + i,
      stock: 5,
      category: 'Clothing',
      sku: `SKU-${i + 1}`,
    })),
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Product pagination', () => {
  it('returns a bare array when no pagination params are given', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(5);
  });

  it('returns a paginated envelope when page and limit are given', async () => {
    const res = await request(app).get('/api/products?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });

  it('returns the second page correctly', async () => {
    const res = await request(app).get('/api/products?page=2&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.page).toBe(2);
  });

  it('returns 400 for an invalid limit', async () => {
    const res = await request(app).get('/api/products?limit=0');

    expect(res.status).toBe(400);
  });
});
