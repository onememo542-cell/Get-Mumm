/**
 * PostgreSQL Connection Pool Module
 * Manages the pg.Pool instance with error handling and statistics
 *
 * This module creates and configures the PostgreSQL connection pool
 * based on validated configuration. It sets up error handlers and
 * provides utilities for monitoring pool health.
 */

import pg from "pg";
import { logger } from "../lib/logger";
import { DatabaseConfig } from "./config";
import { PoolStats, PoolError } from "./types";

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

function resolveSslConfig(
  connectionString: string,
): pg.ConnectionConfig["ssl"] | undefined {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");

    if (sslmode === "disable") {
      return undefined;
    }

    if (
      sslmode === "require"
      || sslmode === "verify-ca"
      || sslmode === "verify-full"
      || url.hostname.endsWith(".supabase.co")
    ) {
      return { rejectUnauthorized: false };
    }
  } catch {
    if (connectionString.includes("supabase.co")) {
      return { rejectUnauthorized: false };
    }
  }

  return undefined;
}

/**
 * Create a configured PostgreSQL connection pool
 *
 * @param config - Validated database configuration
 * @returns Configured pg.Pool instance
 * @throws PoolError if pool creation fails
 *
 * @example
 * ```ts
 * const config = loadDatabaseConfig();
 * const pool = createPool(config);
 * ```
 */
export function createPool(config: DatabaseConfig): pg.Pool {
  if (poolInstance !== null) {
    logger.warn("Pool already exists, returning existing instance");
    return poolInstance;
  }

  try {
    const ssl = resolveSslConfig(config.connectionString);

    poolInstance = new Pool({
      connectionString: config.connectionString,
      connectionTimeoutMillis: config.connectionTimeoutMillis,
      idleTimeoutMillis: config.idleTimeoutMillis,
      max: config.poolSize,
      ...(ssl ? { ssl } : {}),
    });

    logger.debug(
      {
        poolSize: config.poolSize,
        connectionTimeout: config.connectionTimeoutMillis,
        idleTimeout: config.idleTimeoutMillis,
      },
      "Pool instance created",
    );

    // Attach error handler to pool
    attachPoolErrorHandler(poolInstance);

    return poolInstance;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new PoolError(
      `Failed to create connection pool: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Attach error handler to pool to catch unexpected errors
 *
 * @param pool - pg.Pool instance
 */
function attachPoolErrorHandler(pool: pg.Pool): void {
  pool.on("error", (err: Error) => {
    logger.error(
      {
        err,
        message: err.message,
        stack: err.stack,
      },
      "Unexpected error in connection pool",
    );
  });

  pool.on("connect", () => {
    logger.debug("New client connected to pool");
  });

  pool.on("remove", () => {
    logger.debug("Client removed from pool");
  });
}

/**
 * Get the current pool instance
 *
 * @returns pg.Pool instance or null if not initialized
 */
export function getPoolInstance(): pg.Pool | null {
  return poolInstance;
}

/**
 * Get current connection pool statistics
 *
 * Useful for monitoring pool health and detecting connection leaks.
 * The pool object has the following properties:
 * - totalCount: total connections in pool
 * - idleCount: idle connections available
 * - waitingCount: clients waiting for connections
 *
 * @returns Pool statistics or null if pool not initialized
 *
 * @example
 * ```ts
 * const stats = getPoolStats();
 * console.log(`Active connections: ${stats.activeConnections}`);
 * ```
 */
export function getPoolStats(): PoolStats | null {
  if (!poolInstance) {
    return null;
  }

  const totalConnections = poolInstance.totalCount ?? 0;
  const idleConnections = poolInstance.idleCount ?? 0;
  const activeConnections = totalConnections - idleConnections;
  const waitingRequests = poolInstance.waitingCount ?? 0;

  return {
    totalConnections,
    activeConnections,
    waitingRequests,
    idleConnections,
    maxConnections: poolInstance.options?.max ?? 0,
    timestamp: new Date(),
  };
}

/**
 * Check if the connection pool is healthy
 *
 * A pool is considered healthy if:
 * - It exists and is initialized
 * - We can query its stats
 * - It hasn't exceeded error thresholds
 *
 * @returns true if pool is healthy, false otherwise
 */
export function isPoolHealthy(): boolean {
  if (!poolInstance) {
    return false;
  }

  try {
    const stats = getPoolStats();
    if (!stats) {
      return false;
    }

    // Check for critical conditions
    const tooManyWaiting = stats.waitingRequests > stats.maxConnections;
    if (tooManyWaiting) {
      logger.warn(
        { waitingCount: stats.waitingRequests, maxConnections: stats.maxConnections },
        "Pool has too many waiting requests",
      );
      return false;
    }

    return true;
  } catch (error) {
    logger.error({ err: error }, "Error checking pool health");
    return false;
  }
}

/**
 * Drain all connections from the pool
 *
 * This should be called during graceful shutdown to ensure
 * all connections are properly closed before exiting.
 *
 * @param timeoutMs - Maximum time to wait for drain in milliseconds
 * @throws PoolError if drain fails or times out
 *
 * @example
 * ```ts
 * await drainPool(30000); // Wait up to 30 seconds
 * ```
 */
export async function drainPool(timeoutMs: number = 30000): Promise<void> {
  if (!poolInstance) {
    logger.debug("No pool to drain");
    return;
  }

  try {
    logger.info({ timeoutMs }, "Draining connection pool");

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new PoolError(
            `Pool drain timed out after ${timeoutMs}ms`,
          ),
        );
      }, timeoutMs);
    });

    // Race between actual drain and timeout
    await Promise.race([
      poolInstance.end(),
      timeoutPromise,
    ]);

    logger.info("Connection pool drained successfully");
    poolInstance = null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new PoolError(
      `Failed to drain pool: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Force reset the pool (for testing purposes)
 *
 * WARNING: This terminates all connections immediately without
 * waiting for graceful completion. Only use in testing scenarios.
 */
export async function resetPoolForTesting(): Promise<void> {
  if (poolInstance) {
    try {
      await poolInstance.end();
    } catch (error) {
      logger.warn({ err: error }, "Error ending pool during reset");
    }
    poolInstance = null;
  }
}
