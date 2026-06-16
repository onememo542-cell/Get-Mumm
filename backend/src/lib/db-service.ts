/**
 * Centralized database service with Drizzle + Supabase fallback
 */

import { db } from '../db';
import { supabase } from './supabase';
import { DatabaseError } from './errors';
import { logger } from './logger';

const QUERY_TIMEOUT = 5000; // 5 seconds

interface QueryOptions {
  timeout?: number;
  allowFallback?: boolean;
}

/**
 * Execute a Drizzle query with Supabase fallback
 * @param queryFn - The Drizzle query function
 * @param fallbackFn - The Supabase fallback function
 * @param options - Query options
 */
export async function executeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  options: QueryOptions = {},
): Promise<T> {
  const { timeout = QUERY_TIMEOUT, allowFallback = true } = options;

  try {
    // Try Drizzle first with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Database query timeout')),
        timeout,
      ),
    );

    const result = await Promise.race([queryFn(), timeoutPromise]);
    logger.debug('Drizzle query successful');
    return result;
  } catch (drizzleErr) {
    logger.warn(
      { error: drizzleErr instanceof Error ? drizzleErr.message : String(drizzleErr) },
      'Drizzle query failed, attempting Supabase fallback',
    );

    if (!allowFallback) {
      throw new DatabaseError('Database query failed', drizzleErr);
    }

    try {
      const result = await fallbackFn();
      logger.debug('Supabase fallback successful');
      return result;
    } catch (fallbackErr) {
      logger.error(
        { drizzleErr, fallbackErr },
        'Both Drizzle and Supabase queries failed',
      );
      throw new DatabaseError(
        'Failed to fetch data from database',
        { drizzle: drizzleErr, supabase: fallbackErr },
      );
    }
  }
}

/**
 * Execute a database query that returns a single row
 */
export async function executeDbQuerySingle<T>(
  queryFn: () => Promise<T | undefined>,
  fallbackFn: () => Promise<T | undefined>,
  resourceName: string = 'resource',
  options: QueryOptions = {},
): Promise<T> {
  const result = await executeDbQuery(queryFn, fallbackFn, options);

  if (!result) {
    throw new DatabaseError(`${resourceName} not found`);
  }

  return result;
}

/**
 * Execute a database query that returns multiple rows
 */
export async function executeDbQueryMany<T>(
  queryFn: () => Promise<T[]>,
  fallbackFn: () => Promise<T[]>,
  options: QueryOptions = {},
): Promise<T[]> {
  const result = await executeDbQuery(queryFn, fallbackFn, options);
  return result || [];
}
