/**
 * Global error handling middleware
 * Centralized error processing with consistent response format
 */

import { Express, Request, Response, NextFunction } from 'express';
import { ApiException, ValidationError, DatabaseError } from '../lib/errors';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';

interface ErrorResponse {
  error: string;
  code?: string;
  statusCode: number;
  details?: unknown;
  timestamp: string;
}

/**
 * Format error response consistently
 */
function formatErrorResponse(
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown,
): ErrorResponse {
  return {
    error: message,
    code,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && details && { details }),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Setup global error handlers
 */
export function setupErrorHandler(app: Express): void {
  // Catch-all error handler (must be last middleware)
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const requestId = (req as any).id;

    // Handle known ApiException errors
    if (err instanceof ApiException) {
      logger.warn(
        { requestId, statusCode: err.statusCode, errorName: err.name },
        `[${err.name}] ${err.message}`,
      );

      return res.status(err.statusCode).json(
        formatErrorResponse(
          err.statusCode,
          err.message,
          err.name,
          err.details,
        ),
      );
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      logger.warn(
        { requestId, errorCount: err.errors.length },
        'Validation error',
      );

      return res.status(400).json(
        formatErrorResponse(
          400,
          'Validation failed',
          'VALIDATION_ERROR',
          err.flatten(),
        ),
      );
    }

    // Handle generic errors
    if (err instanceof Error) {
      // Log stack trace in development
      if (process.env.NODE_ENV === 'development') {
        logger.error(
          { requestId, stack: err.stack },
          `[${err.name}] ${err.message}`,
        );
      } else {
        logger.error(
          { requestId, errorName: err.name },
          err.message,
        );
      }

      return res.status(500).json(
        formatErrorResponse(
          500,
          'Internal server error',
          'INTERNAL_ERROR',
          process.env.NODE_ENV === 'development' ? { message: err.message } : undefined,
        ),
      );
    }

    // Handle unknown errors
    logger.error({ requestId, error: err }, 'Unknown error type');
    res.status(500).json(
      formatErrorResponse(
        500,
        'Internal server error',
        'UNKNOWN_ERROR',
      ),
    );
  });

  // Handle 404 routes (must be after error handler)
  app.use((_req: Request, res: Response) => {
    res.status(404).json(
      formatErrorResponse(
        404,
        'Route not found',
        'NOT_FOUND',
      ),
    );
  });
}
