import { createClient } from "@supabase/supabase-js";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          "Supabase URL or Service Role Key not defined in environment"
        );
      }

      supabaseInstance = createClient(supabaseUrl, serviceRoleKey);
    }

    return (supabaseInstance as any)[prop];
  },
});
