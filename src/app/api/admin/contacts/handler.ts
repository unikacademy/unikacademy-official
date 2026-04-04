import { supabaseAdmin, toRecords } from "@/lib/supabase-admin";
import { ok } from "@/lib/api";

export async function getAllContacts() {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}
