import { ok } from "@/lib/api";
import { supabaseAdmin, toRecords } from "@/lib/supabase-admin";

// Public — only returns active jobs for the careers page
export async function listActiveJobs() {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}
