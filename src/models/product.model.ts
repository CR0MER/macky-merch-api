import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { NotFoundError } from '../errors/NotFoundError';
import { AppError } from '../errors/AppError';

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
  try {
    const product = await prisma.product.create({ data });
    return serialize(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(400, 'sku must be unique');
    }
    throw err;
  }
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
  try {
    const product = await prisma.product.update({ where: { id }, data });
    return serialize(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(400, 'sku must be unique');
    }
    throw err;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  await getProductById(id);
  await prisma.product.delete({ where: { id } });
}

export interface PaginatedResult {
  data: SerializedProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPaginatedProducts(page: number, limit: number): Promise<PaginatedResult> {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.product.findMany({ skip, take: limit, orderBy: { id: 'asc' } }),
    prisma.product.count(),
  ]);

  return {
    data: items.map(serialize),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}
