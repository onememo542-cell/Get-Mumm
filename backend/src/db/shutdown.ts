/**
 * Graceful Shutdown Handler
 * Manages clean database connection cleanup on process termination
 *
 * Handles SIGTERM and SIGINT signals to gracefully drain the connection
 * pool before process exit. This ensures no connection leaks and allows
 * in-flight queries to complete before shutdown.
 */

import { logger } from "../lib/logger";
import { drainPool } from "./pool";

/** Shutdown timeout in milliseconds */
const SHUTDOWN_TIMEOUT_MS = 30000;

/** Flag to track if shutdown is in progress */
let isShuttingDown = false;

/** Hooks run before the connection pool is drained */
const shutdownHooks: Array<() => void | Promise<void>> = [];

let handlersRegistered = false;

/**
 * Register a callback to run during graceful shutdown (before pool drain).
 */
export function registerShutdownHook(hook: () => void | Promise<void>): void {
  shutdownHooks.push(hook);
}

/**
 * Perform graceful shutdown sequence
 *
 * 1. Log shutdown initiation
 * 2. Drain all connections from pool (with timeout)
 * 3. Exit process with appropriate code
 *
 * @param signal - Signal that triggered shutdown (SIGTERM, SIGINT)
 */
async function performShutdown(signal: string): Promise<void> {
  // Prevent multiple shutdown attempts
  if (isShuttingDown) {
    logger.warn(`Shutdown already in progress, ignoring ${signal}`);
    return;
  }

  isShuttingDown = true;

  try {
    logger.info({ signal }, "Graceful shutdown initiated");

    for (const hook of shutdownHooks) {
      await hook();
    }

    // Drain the connection pool
    await drainPool(SHUTDOWN_TIMEOUT_MS);

    logger.info("Graceful shutdown completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error(
      {
        err: error,
        message: error instanceof Error ? error.message : String(error),
      },
      "Error during graceful shutdown",
    );

    // Force exit after failed shutdown attempt
    process.exit(1);
  }
}

/**
 * Register graceful shutdown handlers
 *
 * Attaches handlers to SIGTERM and SIGINT signals to ensure
 * the database connection pool is properly drained before exit.
 *
 * This should be called once during application initialization.
 *
 * @example
 * ```ts
 * registerShutdownHandlers();
 * ```
 */
export function registerShutdownHandlers(): void {
  if (handlersRegistered) {
    return;
  }
  handlersRegistered = true;

  process.on("SIGTERM", () => {
    performShutdown("SIGTERM").catch((err) => {
      logger.error({ err }, "Fatal error in SIGTERM handler");
      process.exit(1);
    });
  });

  process.on("SIGINT", () => {
    performShutdown("SIGINT").catch((err) => {
      logger.error({ err }, "Fatal error in SIGINT handler");
      process.exit(1);
    });
  });

  // Log that handlers are registered
  logger.debug("Graceful shutdown handlers registered for SIGTERM and SIGINT");
}

/**
 * Get current shutdown state
 * Useful for preventing new operations during shutdown
 *
 * @returns true if shutdown is in progress
 */
export function isShutdownInProgress(): boolean {
  return isShuttingDown;
}
