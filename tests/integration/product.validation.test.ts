import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/prisma';

const app = createApp();

beforeEach(async () => {
  await prisma.product.deleteMany();
});

afterEach(async () => {
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Product validation', () => {
  it('POST /api/products returns 400 with field details when required fields are missing', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Incomplete Product' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'price' })]),
    );
  });

  it('POST /api/products returns 400 when price is not positive', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Bad Price Product',
      price: -10,
      stock: 5,
      category: 'Clothing',
      sku: 'BAD-001',
    });

    expect(res.status).toBe(400);
  });

  it('PUT /api/products/:id returns 400 for an invalid partial update', async () => {
    const created = await prisma.product.create({
      data: { name: 'Mug', price: 150, stock: 40, category: 'Accessories', sku: 'MUG-001' },
    });

    const res = await request(app).put(`/api/products/${created.id}`).send({ stock: -5 });

    expect(res.status).toBe(400);
  });
});
