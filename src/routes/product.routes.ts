import { Router } from 'express';
import * as controller from '../controllers/product.controller';
import { validateBody, validateQuery } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  paginationQuerySchema,
} from '../validators/product.validator';

export const productRouter = Router();

// Routes for the /products endpoint
productRouter.post('/', validateBody(createProductSchema), controller.createProductHandler);

// Routes for the /products endpoint (paginated list)
productRouter.get('/', validateQuery(paginationQuerySchema), controller.listProductsHandler);

// Routes for the /products/:id endpoint
productRouter.get('/:id', controller.getProductHandler);

// Routes for the /products/:id endpoint
productRouter.put('/:id', validateBody(updateProductSchema), controller.updateProductHandler);

// Routes for the /products/:id endpoint
productRouter.delete('/:id', controller.deleteProductHandler);
