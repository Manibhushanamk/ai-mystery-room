import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();

  if (err instanceof ZodError || (err as any)?.name === 'ZodError') {
    const zodErr = err as ZodError;
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: zodErr.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        requestId,
      },
    });
    return;
  }

  const appError = err as AppError;
  const statusCode = appError.statusCode || 500;
  if (statusCode === 500) {
    console.error('[API Internal Error]:', err);
  }
  const code = appError.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR');
  const message =
    statusCode === 500
      ? 'An internal server error occurred. Please try again later.'
      : appError.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId,
    },
  });
}
