import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { error: err.message };
    if (err instanceof ValidationError) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Malformed JSON in request body' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
