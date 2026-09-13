import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  price: z.number().positive('price must be a positive number'),
  stock: z.number().int().nonnegative('stock must be a non-negative integer'),
  category: z.string().trim().min(1, 'category is required'),
  sku: z.string().trim().min(1, 'sku is required'),
  description: z.string().trim().min(1).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
