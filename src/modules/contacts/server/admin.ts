import { supabaseAdmin, toRecord, toRecords } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

export async function getAllContacts() {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}

export async function updateContactStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Contact not found", 404);
  return ok(toRecord(data));
}

export async function deleteContact(id: string) {
  const { error, count } = await supabaseAdmin
    .from("contacts")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Contact not found", 404);
  return ok({ message: "Contact deleted" });
}
