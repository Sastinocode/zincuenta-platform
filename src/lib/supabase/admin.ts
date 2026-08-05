import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/types";

/**
 * Cliente Supabase con la service role key: salta la RLS. Solo importar
 * desde código server-only (Server Actions, Route Handlers) y solo tras
 * comprobar el rol del que llama — nunca desde un Client Component.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
