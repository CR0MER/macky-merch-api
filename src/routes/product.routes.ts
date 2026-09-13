import { Router } from 'express';
import * as controller from '../controllers/product.controller';
import { validateBody } from '../middlewares/validate';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

export const productRouter = Router();

productRouter.post('/', validateBody(createProductSchema), controller.createProductHandler);
productRouter.get('/', controller.listProductsHandler);
productRouter.get('/:id', controller.getProductHandler);
productRouter.put('/:id', validateBody(updateProductSchema), controller.updateProductHandler);
productRouter.delete('/:id', controller.deleteProductHandler);
