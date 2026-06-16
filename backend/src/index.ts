import app from "./app";
import { logger } from "./lib/logger";
import {
  registerShutdownHandlers,
  registerShutdownHook,
} from "./db/shutdown";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, (err) => {
  if (err) {
    const code = (err as NodeJS.ErrnoException).code;

    if (code === "EADDRINUSE") {
      logger.error(
        { port, err },
        `Port ${port} is already in use. Stop the other process with: Get-NetTCPConnection -LocalPort ${port} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`,
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
