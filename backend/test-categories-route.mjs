#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { z } from "zod/v4";

// Define the Zod schema manually since we can't import TS
const ListCategoriesResponseItem = z.object({
  "id": z.number(),
  "name": z.string(),
  "nameAr": z.string(),
  "slug": z.string(),
  "description": z.string(),
  "descriptionAr": z.string(),
  "imageUrl": z.string(),
  "itemCount": z.number()
})
const ListCategoriesResponse = z.array(ListCategoriesResponseItem)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    // Query exactly like the route does
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error("❌ Query error:", error);
      return;
    }

    console.log("✅ Query successful!");
    console.log("\n📊 Raw data count:", data?.length || 0);
    console.log("First record:", JSON.stringify(data?.[0], null, 2));

    // Try to validate
    console.log("\n🔍 Attempting Zod validation...");
    try {
      const validated = ListCategoriesResponse.parse(data);
      console.log("✅ Validation passed!");
      console.log("Validated records:", validated.length);
    } catch (valErr) {
      console.error("❌ Validation failed:");
      console.error(valErr.message);
      console.error("\nProblems with first record:");
      const firstRecord = data?.[0];
      if (firstRecord) {
        console.log("  id:", firstRecord.id, typeof firstRecord.id);
        console.log("  name:", firstRecord.name, typeof firstRecord.name);
        console.log("  nameAr:", firstRecord.name_ar, typeof firstRecord.name_ar);
        console.log("  slug:", firstRecord.slug, typeof firstRecord.slug);
        console.log("  description:", firstRecord.description?.substring(0, 50), typeof firstRecord.description);
        console.log("  descriptionAr:", firstRecord.description_ar?.substring(0, 50), typeof firstRecord.description_ar);
        console.log("  imageUrl:", firstRecord.image_url, typeof firstRecord.image_url);
        console.log("  itemCount:", firstRecord.item_count, typeof firstRecord.item_count);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
