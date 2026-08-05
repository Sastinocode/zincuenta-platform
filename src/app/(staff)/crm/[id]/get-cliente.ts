import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** Memoizado por request: layout y page comparten la misma consulta. */
export const getCliente = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("core_clientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
});
