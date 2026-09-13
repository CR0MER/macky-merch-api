import { Router } from 'express';
import * as controller from '../controllers/product.controller';

export const productRouter = Router();

productRouter.post('/', controller.createProductHandler);
productRouter.get('/', controller.listProductsHandler);
productRouter.get('/:id', controller.getProductHandler);
productRouter.put('/:id', controller.updateProductHandler);
productRouter.delete('/:id', controller.deleteProductHandler);
