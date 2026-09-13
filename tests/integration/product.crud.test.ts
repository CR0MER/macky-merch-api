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

describe('Product CRUD', () => {
  it('POST /api/products creates a product and returns 201', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'LSCS Hoodie',
      price: 799.99,
      stock: 20,
      category: 'Clothing',
      sku: 'HOOD-001',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'LSCS Hoodie',
      price: 799.99,
      stock: 20,
      category: 'Clothing',
      sku: 'HOOD-001',
    });
    expect(res.body.id).toBeTypeOf('number');
  });

  it('GET /api/products returns 200 with an array of products', async () => {
    await prisma.product.create({
      data: { name: 'Tote Bag', price: 250, stock: 15, category: 'Accessories', sku: 'TOTE-001' },
    });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it('GET /api/products/:id returns 200 with the matching product', async () => {
    const created = await prisma.product.create({
      data: { name: 'Cap', price: 199, stock: 10, category: 'Clothing', sku: 'CAP-001' },
    });

    const res = await request(app).get(`/api/products/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.sku).toBe('CAP-001');
  });

  it('GET /api/products/:id returns 404 when the product does not exist', async () => {
    const res = await request(app).get('/api/products/999999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });

  it('PUT /api/products/:id updates a subset of fields', async () => {
    const created = await prisma.product.create({
      data: { name: 'Sticker', price: 20, stock: 100, category: 'Accessories', sku: 'STK-001' },
    });

    const res = await request(app).put(`/api/products/${created.id}`).send({ stock: 50 });

    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(50);
    expect(res.body.name).toBe('Sticker');
  });

  it('PUT /api/products/:id returns 404 when the product does not exist', async () => {
    const res = await request(app).put('/api/products/999999').send({ stock: 5 });

    expect(res.status).toBe(404);
  });

  it('DELETE /api/products/:id deletes the product and returns a success message', async () => {
    const created = await prisma.product.create({
      data: { name: 'Pin', price: 50, stock: 30, category: 'Accessories', sku: 'PIN-001' },
    });

    const res = await request(app).delete(`/api/products/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Product deleted successfully.' });

    const stillThere = await prisma.product.findUnique({ where: { id: created.id } });
    expect(stillThere).toBeNull();
  });

  it('DELETE /api/products/:id returns 404 when the product does not exist', async () => {
    const res = await request(app).delete('/api/products/999999');

    expect(res.status).toBe(404);
  });
});
