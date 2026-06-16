/**
 * Database Configuration Module
 * Validates and parses environment variables for database connection
 *
 * This module ensures that all required database configuration is present
 * and valid before the application attempts to connect. It provides type-safe
 * access to configuration throughout the database module.
 */

import { logger } from "../lib/logger";

/**
 * Represents the environment/deployment context
 */
export type Environment = "development" | "staging" | "production";

/**
 * Type-safe database configuration object
 */
export interface DatabaseConfig {
  /** PostgreSQL connection string */
  connectionString: string;
  /** Maximum number of connections in pool */
  poolSize: number;
  /** Connection timeout in milliseconds */
  connectionTimeoutMillis: number;
  /** Idle connection timeout in milliseconds */
  idleTimeoutMillis: number;
  /** Current deployment environment */
  environment: Environment;
}

/**
 * Parse and validate a string as a positive integer
 * @param value - String value to parse
 * @param fieldName - Name of the field for error messages
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns Parsed integer value
 * @throws Error if value is invalid
 */
function parsePositiveInteger(
  value: string | undefined,
  fieldName: string,
  min: number = 1,
  max: number = Number.MAX_SAFE_INTEGER,
): number {
  if (value === undefined) {
    throw new Error(`${fieldName} is required but was not provided`);
  }

  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(
      `${fieldName} must be a valid integer, got: "${value}"`,
    );
  }

  if (parsed < min || parsed > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max}, got: ${parsed}`,
    );
  }

  return parsed;
}

/**
 * Validate and return the current environment
 * @returns Environment type or throws error if invalid
 */
function validateEnvironment(): Environment {
  const env = process.env.NODE_ENV;

  if (!env) {
    logger.warn(
      "NODE_ENV not set, defaulting to 'development'. Set NODE_ENV=production for production deployments.",
    );
    return "development";
  }

  if (!["development", "staging", "production"].includes(env)) {
    throw new Error(
      `NODE_ENV must be 'development', 'staging', or 'production', got: "${env}"`,
    );
  }

  return env as Environment;
}

/**
 * Get environment-aware pool size recommendations
 * Can be overridden by DB_POOL_SIZE environment variable
 */
function getDefaultPoolSize(environment: Environment): number {
  const defaults: Record<Environment, number> = {
    development: 2,
    staging: 5,
    production: 15,
  };

  return defaults[environment];
}

/**
 * Load and validate database configuration from environment variables
 *
 * Required environment variables:
 * - DATABASE_URL: PostgreSQL connection string
 *
 * Optional environment variables:
 * - DB_POOL_SIZE: Maximum pool size (default: environment-dependent)
 * - DB_CONNECTION_TIMEOUT: Connection timeout in ms (default: 3000)
 * - DB_IDLE_TIMEOUT: Idle timeout in ms (default: 10000)
 * - NODE_ENV: 'development' | 'staging' | 'production' (default: 'development')
 *
 * @returns Validated DatabaseConfig object
 * @throws Error if any required or optional environment variable is invalid
 *
 * @example
 * ```ts
 * const config = loadDatabaseConfig();
 * console.log(`Connecting to database with pool size: ${config.poolSize}`);
 * ```
 */
export function loadDatabaseConfig(): DatabaseConfig {
  const environment = validateEnvironment();

  // Validate required DATABASE_URL
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required but was not provided. " +
      "Did you forget to provision a database?",
    );
  }

  // Validate connection string looks reasonable (basic check)
  if (!connectionString.includes("postgres://") && !connectionString.includes("postgresql://")) {
    logger.warn(
      "DATABASE_URL does not look like a PostgreSQL connection string. " +
      "Expected format: postgresql://user:password@host:port/dbname",
    );
  }

  // Get pool size with environment-aware default
  const defaultPoolSize = getDefaultPoolSize(environment);
  const poolSizeStr = process.env.DB_POOL_SIZE ?? String(defaultPoolSize);
  const poolSize = parsePositiveInteger(
    poolSizeStr,
    "DB_POOL_SIZE",
    1, // minimum 1 connection
    50, // maximum 50 connections
  );

  // Validate connection timeout (in milliseconds)
  const connectionTimeoutStr = process.env.DB_CONNECTION_TIMEOUT ?? "3000";
  const connectionTimeoutMillis = parsePositiveInteger(
    connectionTimeoutStr,
    "DB_CONNECTION_TIMEOUT",
    100, // minimum 100ms
    30000, // maximum 30s
  );

  // Validate idle timeout (in milliseconds)
  const idleTimeoutStr = process.env.DB_IDLE_TIMEOUT ?? "10000";
  const idleTimeoutMillis = parsePositiveInteger(
    idleTimeoutStr,
    "DB_IDLE_TIMEOUT",
    1000, // minimum 1s
    3600000, // maximum 1 hour
  );

  const config: DatabaseConfig = {
    connectionString,
    poolSize,
    connectionTimeoutMillis,
    idleTimeoutMillis,
    environment,
  };

  // Log configuration summary (without sensitive data)
  logger.info(
    {
      environment: config.environment,
      poolSize: config.poolSize,
      connectionTimeout: config.connectionTimeoutMillis,
      idleTimeout: config.idleTimeoutMillis,
    },
    "Database configuration loaded",
  );

  return config;
}

/**
 * Validate that configuration is healthy at runtime
 * Useful for health check endpoints
 */
export function validateConfig(config: DatabaseConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.connectionString) {
    errors.push("connectionString is missing");
  }

  if (config.poolSize < 1 || config.poolSize > 50) {
    errors.push(`poolSize out of valid range (1-50): ${config.poolSize}`);
  }

  if (config.connectionTimeoutMillis < 100 || config.connectionTimeoutMillis > 30000) {
    errors.push(
      `connectionTimeoutMillis out of valid range (100-30000): ${config.connectionTimeoutMillis}`,
    );
  }

  if (config.idleTimeoutMillis < 1000 || config.idleTimeoutMillis > 3600000) {
    errors.push(
      `idleTimeoutMillis out of valid range (1000-3600000): ${config.idleTimeoutMillis}`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
