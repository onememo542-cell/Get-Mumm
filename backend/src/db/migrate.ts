/**
 * Programmatic migrator – reads all *.sql files from ./migrations
 * and executes them in alphabetical order against the Supabase DB.
 *
 * Run with:
 *   node --env-file=.env --import tsx src/db/migrate.ts
 */
import { getPoolForMigrations } from "./index.js";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

async function run() {
  const pool = getPoolForMigrations();
  const client = await pool.connect();
  try {
    console.log("🔄 Running migrations from:", MIGRATIONS_DIR);

    // Ensure a tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const alreadyApplied = await client.query(
        "SELECT 1 FROM _migrations WHERE filename = $1",
        [file],
      );
      if (alreadyApplied.rowCount && alreadyApplied.rowCount > 0) {
        console.log(`  ⏭  Skipping (already applied): ${file}`);
        continue;
      }

      const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`  ▶  Applying: ${file}`);
      await client.query(sql);
      await client.query(
        "INSERT INTO _migrations (filename) VALUES ($1)",
        [file],
      );
      console.log(`  ✓  Applied: ${file}`);
    }

    console.log("\n✅ All migrations applied successfully!\n");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
