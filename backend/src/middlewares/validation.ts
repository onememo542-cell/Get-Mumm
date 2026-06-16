/**
 * Request validation middleware - Centralized validation with async-handler support
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../lib/errors';

/**
 * Generic validation helper - can be used in middleware or route handlers
 */
export function validateSchema<T>(
  data: unknown,
  schema: ZodSchema<T>,
  context: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(`Invalid ${context}`, result.error.flatten());
  }
  return result.data;
}

/**
 * Validate request body against a Zod schema
 */
export function validateBody(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = validateSchema(req.body, schema, 'request body');
    next();
  };
}

/**
 * Validate request query parameters against a Zod schema
 */
export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.query = validateSchema(req.query, schema, 'query parameters') as any;
    next();
  };
}

/**
 * Validate request params against a Zod schema
 */
export function validateParams(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.params = validateSchema(req.params, schema, 'route parameters') as any;
    next();
  };
}
