/**
 * Async route handler wrapper - catches errors and passes to error middleware
 * Also supports combined async + validation operations
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap async route handlers to catch errors
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Compose multiple middlewares/handlers into one
 * Useful for combining validation + async handlers
 */
export function compose(...handlers: RequestHandler[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dispatch = (i: number): void => {
      if (i >= handlers.length) {
        next();
        return;
      }

      try {
        Promise.resolve(handlers[i](req, res, () => dispatch(i + 1))).catch(next);
      } catch (err) {
        next(err);
      }
    };

    dispatch(0);
  };
}
