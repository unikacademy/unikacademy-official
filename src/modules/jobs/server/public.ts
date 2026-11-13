import { ok } from "@/lib/api";
import { supabaseAdmin, toRecords } from "@/lib/supabase-admin";

// Active jobs, newest first. The careers page calls this directly (see the
// note on getActiveCourses in modules/courses/server/public.ts).
export async function getActiveJobs() {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return toRecords(data ?? []);
}

// Public — only returns active jobs for the careers page
export async function listActiveJobs() {
  return ok(await getActiveJobs());
}
