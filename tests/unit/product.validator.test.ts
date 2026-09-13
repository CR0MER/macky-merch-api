import { describe, it, expect } from 'vitest';
import { createProductSchema, updateProductSchema } from '../../src/validators/product.validator';

describe('createProductSchema', () => {
  const validPayload = {
    name: 'LSCS Hoodie',
    price: 799.99,
    stock: 20,
    category: 'Clothing',
    sku: 'HOOD-001',
  };

  it('accepts a valid product payload', () => {
    expect(createProductSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = createProductSchema.safeParse({ ...validPayload, price: -5 });
    expect(result.success).toBe(false);
  });

  it('rejects a missing name', () => {
    const { name, ...rest } = validPayload;
    const result = createProductSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer stock', () => {
    const result = createProductSchema.safeParse({ ...validPayload, stock: 1.5 });
    expect(result.success).toBe(false);
  });
});

describe('updateProductSchema', () => {
  it('accepts a partial payload with a single field', () => {
    expect(updateProductSchema.safeParse({ stock: 5 }).success).toBe(true);
  });

  it('rejects an invalid field even when partial', () => {
    expect(updateProductSchema.safeParse({ price: -1 }).success).toBe(false);
  });
});
