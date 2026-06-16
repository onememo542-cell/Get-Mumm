/**
 * Database Module Type Definitions
 * Centralized types for database functionality
 */

/**
 * Connection pool statistics
 * Used for monitoring and health checks
 */
export interface PoolStats {
  /** Total number of clients in the pool */
  totalConnections: number;
  /** Number of clients currently in use */
  activeConnections: number;
  /** Number of clients waiting for a connection */
  waitingRequests: number;
  /** Number of idle clients available */
  idleConnections: number;
  /** Maximum allowed connections */
  maxConnections: number;
  /** Timestamp when stats were collected */
  timestamp: Date;
}

/**
 * Database health check result
 */
export interface HealthCheckResult {
  /** Whether the database is healthy */
  healthy: boolean;
  /** Optional error message if unhealthy */
  error?: string;
  /** Response time in milliseconds */
  responseTime: number;
  /** Connection pool statistics */
  poolStats: PoolStats;
}

/**
 * Custom error for database-specific issues
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Custom error for configuration issues
 */
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

/**
 * Custom error for connection pool issues
 */
export class PoolError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = "PoolError";
  }
}
