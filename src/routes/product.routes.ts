import { Router } from 'express';
import * as controller from '../controllers/product.controller';
import { validateBody, validateQuery } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  paginationQuerySchema,
} from '../validators/product.validator';

export const productRouter = Router();

productRouter.post('/', validateBody(createProductSchema), controller.createProductHandler);
productRouter.get('/', validateQuery(paginationQuerySchema), controller.listProductsHandler);
productRouter.get('/:id', controller.getProductHandler);
productRouter.put('/:id', validateBody(updateProductSchema), controller.updateProductHandler);
productRouter.delete('/:id', controller.deleteProductHandler);
