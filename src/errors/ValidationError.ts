import { ZodError } from 'zod';
import { AppError } from './AppError';

export interface FieldErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public readonly details: FieldErrorDetail[];

  constructor(zodError: ZodError) {
    super(400, 'Validation failed');
    this.name = 'ValidationError';
    this.details = zodError.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
  }
}
