import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with timeouts to handle IPv6 connection issues
let poolInstance: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      max: 2,
    });

    poolInstance.on('error', (err) => {
      console.error('Pool error:', err);
    });
  }
  return poolInstance;
}

// Create drizzle instance (lazy via getPool)
export const db = drizzle(() => getPool(), { schema });

export { getPool as pool };

export * from "./schema";
