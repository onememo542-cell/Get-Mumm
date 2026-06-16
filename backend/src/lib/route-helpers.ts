/**
 * Reusable route handler patterns
 * Provides common patterns for building consistent API endpoints
 */

import { Response } from "express";
import { ZodSchema } from "zod";
import { executeDbQueryMany, executeDbQuerySingle } from "./db-service";

interface ListQueryOptions<T> {
  drizzleQuery: () => Promise<T[]>;
  supabaseQuery: () => Promise<T[]>;
  responseSchema: ZodSchema;
}

interface SingleQueryOptions<T> {
  drizzleQuery: () => Promise<T | undefined>;
  supabaseQuery: () => Promise<T | undefined>;
  responseSchema: ZodSchema;
  resourceName: string;
}

/**
 * Handle a typical list query (GET /resource)
 * Validates, queries database, and returns formatted response
 */
export async function handleListQuery<T>(
  res: Response,
  options: ListQueryOptions<T>,
): Promise<void> {
  const data = await executeDbQueryMany(
    options.drizzleQuery,
    options.supabaseQuery,
  );

  res.json(options.responseSchema.parse(data));
}

/**
 * Handle a typical single resource query (GET /resource/:id)
 * Validates, queries database, and returns formatted response
 */
export async function handleSingleQuery<T>(
  res: Response,
  options: SingleQueryOptions<T>,
): Promise<void> {
  const data = await executeDbQuerySingle(
    options.drizzleQuery,
    options.supabaseQuery,
    options.resourceName,
  );

  res.json(options.responseSchema.parse(data));
}

/**
 * Build a WHERE clause condition for Drizzle
 * Helps avoid repetitive condition building in routes
 */
export function buildConditions(
  filters: Record<string, unknown>,
  schemaMap: Record<string, (value: unknown) => unknown>,
): unknown[] {
  const conditions: unknown[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value != null && schemaMap[key]) {
      conditions.push(schemaMap[key](value));
    }
  }

  return conditions;
}

/**
 * Build Supabase query with filters
 * Helps avoid repetitive filter building for Supabase
 */
export function buildSupabaseFilters(
  query: any,
  filters: Record<string, unknown>,
  filterMap: Record<string, { column: string; operator?: "eq" | "lte" | "gte" | "ilike" } >,
): any {
  for (const [key, value] of Object.entries(filters)) {
    if (value != null && filterMap[key]) {
      const { column, operator = "eq" } = filterMap[key];

      if (operator === "eq") {
        query = query.eq(column, value);
      } else if (operator === "lte") {
        query = query.lte(column, value);
      } else if (operator === "gte") {
        query = query.gte(column, value);
      } else if (operator === "ilike") {
        query = query.ilike(column, `%${value}%`);
      }
    }
  }

  return query;
}
