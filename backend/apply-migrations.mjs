#!/usr/bin/env node
import pg from "pg";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ Missing DATABASE_URL environment variable");
  process.exit(1);
}

async function applyMigrations() {
  const pool = new Pool({
    connectionString: dbUrl,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    console.log("✅ Connected to database");

    // Read migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    console.log(`📂 Found ${migrationFiles.length} migration files\n`);

    // Apply each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`📝 Applying migration: ${file}`);

      try {
        await client.query(sql);
        console.log(`✅ Successfully applied ${file}\n`);
      } catch (err) {
        console.error(`❌ Failed to apply ${file}`);
        console.error(`Error: ${err.message}\n`);
        // Continue to next migration
      }
    }

    console.log("✨ All migrations processed!");

    // Verify data
    console.log("\n📊 Verifying data...");
    
    try {
      const categoriesResult = await client.query("SELECT COUNT(*) FROM categories");
      const chefsResult = await client.query("SELECT COUNT(*) FROM chefs");
      const menuItemsResult = await client.query("SELECT COUNT(*) FROM menu_items");

      console.log(`  Categories: ${categoriesResult.rows[0]?.count || 0}`);
      console.log(`  Chefs: ${chefsResult.rows[0]?.count || 0}`);
      console.log(`  Menu Items: ${menuItemsResult.rows[0]?.count || 0}`);
    } catch (err) {
      console.log("  ⚠️  Unable to verify data (tables may not exist yet)");
    }

    client.release();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyMigrations();
