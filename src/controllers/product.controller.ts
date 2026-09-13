import { NextFunction, Request, Response } from 'express';
import * as productModel from '../models/product.model';
import { NotFoundError } from '../errors/NotFoundError';

function parseId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id)) {
    throw new NotFoundError();
  }
  return id;
}

export async function createProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productModel.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function listProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = (res.locals.query ?? {}) as { page?: number; limit?: number };

    if (page !== undefined || limit !== undefined) {
      const result = await productModel.getPaginatedProducts(page ?? 1, limit ?? 10);
      res.status(200).json(result);
      return;
    }

    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const product = await productModel.getProductById(id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const product = await productModel.updateProduct(id, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    await productModel.deleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    next(err);
  }
}
