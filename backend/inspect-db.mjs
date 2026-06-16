#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("📊 Inspecting Supabase database...\n");

  try {
    // Get categories with limit 1 to see the structure
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error fetching categories:", error);
      return;
    }

    if (data && data.length > 0) {
      console.log("✅ Categories table exists!");
      console.log("\n📋 First category record:");
      console.log(JSON.stringify(data[0], null, 2));
      console.log("\n🔑 Available fields:");
      Object.keys(data[0]).forEach((key) => {
        console.log(`  - ${key}: ${typeof data[0][key]}`);
      });
    } else {
      console.log("⚠️  Categories table is empty");
    }

    // Check other tables
    const tables = ["chefs", "menu_items", "testimonials"];
    console.log("\n📈 Table row counts:");
    
    for (const table of tables) {
      const { count, error: err } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (err) {
        console.log(`  ${table}: ❌ Error - ${err.message}`);
      } else {
        console.log(`  ${table}: ${count || 0} rows`);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

inspect();
