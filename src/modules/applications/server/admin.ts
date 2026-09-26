import { supabaseAdmin, toRecord, toRecords } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

export async function getAllApplications() {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}

export async function updateApplicationStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Application not found", 404);
  return ok(toRecord(data));
}

export async function deleteApplication(id: string) {
  const { error, count } = await supabaseAdmin
    .from("applications")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Application not found", 404);
  return ok({ message: "Application deleted" });
}
