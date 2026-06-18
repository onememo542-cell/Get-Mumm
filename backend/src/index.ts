import app from "./app";
import { logger } from "./lib/logger";
import {
  registerShutdownHandlers,
  registerShutdownHook,
} from "./db/shutdown";

// For local development only
const isDevelopment = process.env.NODE_ENV !== "production";

if (isDevelopment) {
  // Local development: listen on PORT
  const rawPort = process.env["PORT"] || "8080";
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  const server = app.listen(port, (err) => {
    if (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any).code;
      if (code === "EADDRINUSE") {
        logger.error(
          { port, err },
          `Port ${port} is already in use.`,
        );
      } else {
        logger.error({ err }, "Error listening on port");
      }
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });

  registerShutdownHook(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((closeErr) => {
          if (closeErr) {
            reject(closeErr);
            return;
          }
          logger.info({ port }, "HTTP server closed");
          resolve();
        });
      }),
  );

  registerShutdownHandlers();
}

// Export app for Vercel serverless environment
// IMPORTANT: Always export app, even in production (Vercel calls it as a function)
export default app;
