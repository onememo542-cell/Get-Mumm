/**
 * Database Module
 * Main entry point for database initialization and access
 *
 * Initializes the PostgreSQL connection pool and Drizzle ORM instance
 * with validated configuration. Sets up error handling and graceful shutdown.
 *
 * @example
 * ```ts
 * // Import database and use it in your routes
 * import { db } from './db';
 *
 * const user = await db.query.users.findFirst();
 * ```
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { logger } from "../lib/logger";

import * as schema from "./schema";
import { loadDatabaseConfig } from "./config";
import { createPool, getPoolStats } from "./pool";
import type { DatabaseConfig } from "./config";

// Initialize database state variables
let config: DatabaseConfig | null = null;
let poolInstanceVar: any = null;
let dbInstance: any = null;
let initError: Error | null = null;
let isInitialized = false;

/**
 * Initialize the database connection lazily
 * This prevents app crash if database is unavailable on startup
 */
function initializeDatabase(): void {
  if (isInitialized || initError) {
    return;
  }

  try {
    // Validate configuration at startup
    config = loadDatabaseConfig();

    // Create and configure connection pool
    poolInstanceVar = createPool(config);

    // Create Drizzle ORM instance
    dbInstance = drizzle(poolInstanceVar, { schema });

    isInitialized = true;
    logger.info("Database module initialized successfully");
  } catch (error) {
    initError = error as Error;
    logger.error(
      {
        err: error,
        message: error instanceof Error ? error.message : String(error),
      },
      "Failed to initialize database module",
    );
  }
}

/**
 * Get the database instance, initializing if necessary
 */
function getDbInstance(): typeof dbInstance {
  if (initError) {
    throw new Error(
      `Cannot use database: ${initError.message}`,
    );
  }

  if (!isInitialized) {
    initializeDatabase();
  }

  if (!dbInstance) {
    throw new Error("Database failed to initialize");
  }

  return dbInstance;
}

// Export a lazy proxy that initializes on first access
export const db = new Proxy({}, {
  get: (target, prop) => {
    const database = getDbInstance();
    return (database as any)[prop];
  },
}) as any;

/**
 * Get the PostgreSQL connection pool instance
 *
 * @returns pg.Pool instance
 */
export function getPool() {
  if (!isInitialized && !initError) {
    initializeDatabase();
  }
  if (initError) {
    throw new Error(`Cannot use database: ${initError.message}`);
  }
  if (!poolInstanceVar) {
    throw new Error("Database pool not initialized");
  }
  return poolInstanceVar;
}

/**
 * Export the pool instance directly for backward compatibility
 * Used by migrate.ts and seed.ts scripts
 */
export function getPoolForMigrations() {
  if (!isInitialized && !initError) {
    initializeDatabase();
  }
  if (initError) {
    throw new Error(`Cannot use database: ${initError.message}`);
  }
  if (!poolInstanceVar) {
    throw new Error("Database pool not initialized for migrations");
  }
  return poolInstanceVar;
}

export { getPoolForMigrations as pool };

/**
 * Get current pool statistics
 *
 * @returns Pool statistics or null if pool not initialized
 */
export function getPoolStatsForMonitoring() {
  if (!poolInstanceVar) {
    return null;
  }
  return getPoolStats();
}

/**
 * Export database configuration for reference
 *
 * @internal
 */
export function getDatabaseConfig() {
  if (!config) {
    throw new Error("Database configuration not initialized");
  }
  return config;
}

/**
 * Export configuration type
 */
export type { DatabaseConfig };

// Re-export schema for convenience
export * from "./schema";

// Re-export types for external use
export * from "./types";
