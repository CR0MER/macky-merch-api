import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/prisma';

const app = createApp();

beforeEach(async () => {
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Product edge cases', () => {
  it('POST /api/products returns 400 when sku is already taken', async () => {
    await prisma.product.create({
      data: { name: 'Original', price: 100, stock: 10, category: 'Clothing', sku: 'DUP-001' },
    });

    const res = await request(app).post('/api/products').send({
      name: 'Duplicate',
      price: 120,
      stock: 5,
      category: 'Clothing',
      sku: 'DUP-001',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('sku must be unique');
  });

  it('GET /api/products/:id returns 404 for a non-numeric id', async () => {
    const res = await request(app).get('/api/products/not-a-number');
    expect(res.status).toBe(404);
  });

  it('PUT /api/products/:id returns 404 for a non-numeric id', async () => {
    const res = await request(app).put('/api/products/not-a-number').send({ stock: 1 });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/products/:id returns 404 for a non-numeric id', async () => {
    const res = await request(app).delete('/api/products/not-a-number');
    expect(res.status).toBe(404);
  });
});
