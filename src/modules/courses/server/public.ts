import { ok } from "@/lib/api";
import { supabaseAdmin, toRecords } from "@/lib/supabase-admin";

// Public — returns only active courses, sorted by category order
export async function listActiveCourses() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("order")
    .order("created_at");

  if (error) throw error;
  return ok(toRecords(data ?? []));
}
