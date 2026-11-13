import { ok } from "@/lib/api";
import { supabaseAdmin, toRecords } from "@/lib/supabase-admin";

// Active courses, sorted by category order. Server components call this
// directly — fetching our own /api/courses from a page costs a second function
// invocation and forces the page to render on every request.
export async function getActiveCourses() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("order")
    .order("created_at");

  if (error) throw error;
  return toRecords(data ?? []);
}

// Public — returns only active courses, sorted by category order
export async function listActiveCourses() {
  return ok(await getActiveCourses());
}
