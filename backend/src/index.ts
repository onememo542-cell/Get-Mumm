import app from "./app";
import { logger } from "./lib/logger";
import {
  registerShutdownHandlers,
  registerShutdownHook,
} from "./db/shutdown";

// Detect if running in serverless environment
const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
const nodeEnv = process.env.NODE_ENV || "development";
const port = process.env.PORT || "3001";

logger.info(
  {
    isServerless,
    nodeEnv,
    port,
    databaseUrl: process.env.DATABASE_URL ? "configured" : "NOT_SET",
    supabaseUrl: process.env.SUPABASE_URL ? "configured" : "NOT_SET",
  },
  "Backend startup environment",
);

// For local development only (NOT in serverless)
if (!isServerless && process.env.NODE_ENV !== "production") {
  // Local development: listen on PORT
  const rawPort = port;
  const portNum = Number(rawPort);

  if (Number.isNaN(portNum) || portNum <= 0) {
    logger.error({ rawPort }, "Invalid PORT value");
    process.exit(1);
  }

  const server = app.listen(portNum, (err) => {
    if (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any).code;
      if (code === "EADDRINUSE") {
        logger.error(
          { port: portNum, err },
          `Port ${portNum} is already in use.`,
        );
      } else {
        logger.error({ err }, "Error listening on port");
      }
      process.exit(1);
    }
    logger.info({ port: portNum }, "✓ Server listening and ready");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception - shutting down");
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
  });

  registerShutdownHook(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((closeErr) => {
          if (closeErr) {
            reject(closeErr);
            return;
          }
          logger.info({ port: portNum }, "HTTP server closed");
          resolve();
        });
      }),
  );

  registerShutdownHandlers();
} else {
  logger.info("Serverless or production mode - skipping server.listen()");
}

// Export app for Vercel serverless environment
// IMPORTANT: Always export app, even in production (Vercel calls it as a function)
export default app;
