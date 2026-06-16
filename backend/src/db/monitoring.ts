/**
 * Database Monitoring Utilities
 * Provides health checks and diagnostics for database and connection pool
 *
 * These utilities are useful for:
 * - Health check endpoints
 * - Kubernetes/container orchestration probes
 * - Monitoring and alerting systems
 * - Debugging connection issues
 */

import { logger } from "../lib/logger";
import { getPoolInstance, getPoolStats, isPoolHealthy } from "./pool";
import { HealthCheckResult, PoolStats } from "./types";

/**
 * Perform a comprehensive database health check
 *
 * Verifies both the connection pool state and database connectivity
 * by executing a simple query. Returns detailed diagnostics.
 *
 * @returns Health check result with status and diagnostics
 *
 * @example
 * ```ts
 * const health = await checkDatabaseHealth();
 * if (health.healthy) {
 *   res.json(health);
 * } else {
 *   res.status(503).json(health);
 * }
 * ```
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  const pool = getPoolInstance();

  if (!pool) {
    const responseTime = performance.now() - startTime;
    return {
      healthy: false,
      error: "Database pool not initialized",
      responseTime,
      poolStats: {
        totalConnections: 0,
        activeConnections: 0,
        waitingRequests: 0,
        idleConnections: 0,
        maxConnections: 0,
        timestamp: new Date(),
      },
    };
  }

  const poolStats = getPoolStats();
  if (!poolStats) {
    const responseTime = performance.now() - startTime;
    return {
      healthy: false,
      error: "Could not retrieve pool statistics",
      responseTime,
      poolStats: {
        totalConnections: 0,
        activeConnections: 0,
        waitingRequests: 0,
        idleConnections: 0,
        maxConnections: 0,
        timestamp: new Date(),
      },
    };
  }

  try {
    // Execute a simple query to verify database connectivity
    await pool.query("SELECT 1");

    const responseTime = performance.now() - startTime;
    const poolHealthy = isPoolHealthy();

    logger.debug(
      { responseTime, poolHealthy, poolStats },
      "Database health check completed",
    );

    return {
      healthy: poolHealthy,
      responseTime,
      poolStats,
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(
      {
        err: error,
        responseTime,
        poolStats,
      },
      "Database health check failed",
    );

    return {
      healthy: false,
      error: `Database query failed: ${errorMessage}`,
      responseTime,
      poolStats,
    };
  }
}

/**
 * Get current connection pool statistics
 *
 * Returns detailed information about pool utilization and performance.
 * Useful for monitoring dashboards and debugging.
 *
 * @returns Pool statistics or null if pool not initialized
 *
 * @example
 * ```ts
 * const stats = getPoolStatsForMonitoring();
 * console.log(`Using ${stats?.activeConnections}/${stats?.maxConnections} connections`);
 * ```
 */
export function getPoolStatsForMonitoring(): PoolStats | null {
  return getPoolStats();
}

/**
 * Check if pool has connection exhaustion issues
 *
 * Returns true if:
 * - Most or all connections are in use
 * - Many requests are waiting for connections
 *
 * Useful for alerting when connection pool needs tuning.
 *
 * @param utilizationThreshold - Percentage (0-100) at which to warn (default: 80)
 * @returns true if pool is over-utilized
 */
export function isPoolOverUtilized(utilizationThreshold: number = 80): boolean {
  const stats = getPoolStats();
  if (!stats) {
    return false;
  }

  const utilizationPercent = (stats.activeConnections / stats.maxConnections) * 100;
  const overUtilized = utilizationPercent > utilizationThreshold;

  if (overUtilized) {
    logger.warn(
      {
        utilizationPercent: Math.round(utilizationPercent),
        activeConnections: stats.activeConnections,
        maxConnections: stats.maxConnections,
        threshold: utilizationThreshold,
      },
      "Connection pool over-utilized",
    );
  }

  return overUtilized;
}

/**
 * Check if pool has excessive waiting requests
 *
 * Returns true if the number of waiting requests exceeds a threshold.
 * This indicates the pool might be too small for current load.
 *
 * @param waitingThreshold - Number of waiting requests to warn at (default: 10)
 * @returns true if waiting requests exceed threshold
 */
export function hasExcessiveWaitingRequests(waitingThreshold: number = 10): boolean {
  const stats = getPoolStats();
  if (!stats) {
    return false;
  }

  const hasExcessive = stats.waitingRequests > waitingThreshold;

  if (hasExcessive) {
    logger.warn(
      {
        waitingRequests: stats.waitingRequests,
        threshold: waitingThreshold,
        activeConnections: stats.activeConnections,
        maxConnections: stats.maxConnections,
      },
      "Pool has excessive waiting requests",
    );
  }

  return hasExcessive;
}

/**
 * Get comprehensive diagnostics for troubleshooting
 *
 * Returns detailed information useful for debugging connection issues.
 *
 * @returns Diagnostic report object
 *
 * @example
 * ```ts
 * const diagnostics = getDiagnostics();
 * console.log(JSON.stringify(diagnostics, null, 2));
 * ```
 */
export function getDiagnostics() {
  const pool = getPoolInstance();
  const poolStats = getPoolStats();
  const poolHealthy = isPoolHealthy();
  const overUtilized = isPoolOverUtilized();
  const excessiveWaiting = hasExcessiveWaitingRequests();

  return {
    timestamp: new Date().toISOString(),
    poolInitialized: pool !== null,
    poolHealthy,
    poolStats,
    alerts: {
      overUtilized,
      excessiveWaiting,
    },
    recommendations: generateRecommendations(
      poolStats,
      overUtilized,
      excessiveWaiting,
    ),
  };
}

/**
 * Generate actionable recommendations based on current state
 *
 * @internal
 */
function generateRecommendations(
  poolStats: PoolStats | null,
  overUtilized: boolean,
  excessiveWaiting: boolean,
): string[] {
  const recommendations: string[] = [];

  if (!poolStats) {
    recommendations.push("Pool statistics unavailable");
    return recommendations;
  }

  if (overUtilized) {
    recommendations.push(
      `Increase DB_POOL_SIZE from ${poolStats.maxConnections} (currently ${Math.round((poolStats.activeConnections / poolStats.maxConnections) * 100)}% utilized)`,
    );
  }

  if (excessiveWaiting) {
    recommendations.push(
      `Too many waiting requests (${poolStats.waitingRequests}). Increase pool size or reduce query load.`,
    );
  }

  if (poolStats.idleConnections === 0 && poolStats.activeConnections > 0) {
    recommendations.push(
      "All pool connections are in use. Monitor for connection leaks.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("Pool is healthy and well-utilized");
  }

  return recommendations;
}
