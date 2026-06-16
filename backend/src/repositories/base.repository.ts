/**
 * Base Repository
 * Common patterns for all repositories
 */

import { executeDbQueryMany, executeDbQuerySingle, executeDbQuery } from "../lib/db-service";

/**
 * Base repository with common query methods
 */
export abstract class BaseRepository {
  /**
   * Execute a database query that returns multiple rows
   */
  protected async findMany<T>(
    drizzleQuery: () => Promise<T[]>,
    supabaseQuery: () => Promise<T[]>,
  ): Promise<T[]> {
    return executeDbQueryMany(drizzleQuery, supabaseQuery);
  }

  /**
   * Execute a database query that returns a single row
   */
  protected async findOne<T>(
    drizzleQuery: () => Promise<T | undefined>,
    supabaseQuery: () => Promise<T | undefined>,
    resourceName: string,
  ): Promise<T> {
    return executeDbQuerySingle(drizzleQuery, supabaseQuery, resourceName);
  }

  /**
   * Execute a database mutation query
   */
  protected async execute<T>(
    drizzleQuery: () => Promise<T>,
    supabaseQuery: () => Promise<T>,
  ): Promise<T> {
    return executeDbQuery(drizzleQuery, supabaseQuery);
  }
}
