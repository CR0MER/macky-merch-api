import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message = 'Product not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
