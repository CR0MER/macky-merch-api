import express, { Express } from 'express';
import { productRouter } from './routes/product.routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/products', productRouter);

  app.use(errorHandler);

  return app;
}
