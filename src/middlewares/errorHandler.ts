import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { error: err.message };
    if ('details' in err) {
      body.details = (err as unknown as { details: unknown }).details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
