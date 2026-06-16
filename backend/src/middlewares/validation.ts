/**
 * Request validation middleware - Centralized validation with async-handler support
 */

import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../lib/errors";

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedParams?: unknown;
      validatedBody?: unknown;
    }
  }
}

export function getValidatedQuery<T>(req: Request): T {
  return req.validatedQuery as T;
}

export function getValidatedParams<T>(req: Request): T {
  return req.validatedParams as T;
}

export function getValidatedBody<T>(req: Request): T {
  return req.validatedBody as T;
}

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
    req.validatedBody = validateSchema(req.body, schema, "request body");
    next();
  };
}

/**
 * Validate request query parameters against a Zod schema
 */
export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validatedQuery = validateSchema(req.query, schema, "query parameters");
    next();
  };
}

/**
 * Validate request params against a Zod schema
 */
export function validateParams(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validatedParams = validateSchema(req.params, schema, "route parameters");
    next();
  };
}
