import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { NotFoundError } from '../errors/NotFoundError';

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  description?: string | null;
}

export interface SerializedProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function serialize(product: {
  id: number;
  name: string;
  price: Prisma.Decimal;
  stock: number;
  category: string;
  sku: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SerializedProduct {
  return { ...product, price: Number(product.price) };
}

export async function createProduct(data: ProductInput): Promise<SerializedProduct> {
  const product = await prisma.product.create({ data });
  return serialize(product);
}

export async function getAllProducts(): Promise<SerializedProduct[]> {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return products.map(serialize);
}

export async function getProductById(id: number): Promise<SerializedProduct> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError();
  }
  return serialize(product);
}

export async function updateProduct(
  id: number,
  data: Partial<ProductInput>,
): Promise<SerializedProduct> {
  await getProductById(id);
  const product = await prisma.product.update({ where: { id }, data });
  return serialize(product);
}

export async function deleteProduct(id: number): Promise<void> {
  await getProductById(id);
  await prisma.product.delete({ where: { id } });
}
