/**
 * Vercel Entrypoint
 * This file is used by @vercel/node builder to route requests to the Express app
 */

import { VercelRequest, VercelResponse } from "@vercel/node";

// Import app from src
import app from "./src/app";
import { logger } from "./src/lib/logger";

/**
 * Export handler for Vercel serverless environment
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  // Log the request
  logger.info(
    { method: req.method, url: req.url },
    "Incoming request",
  );

  try {
    // Handle the request through Express
    return new Promise<void>((resolve, reject) => {
      app(req, res as any, (err: any) => {
        if (err) {
          logger.error({ err }, "Express error");
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    logger.error({ err }, "Handler error");
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to process request",
      });
    }
  }
};
