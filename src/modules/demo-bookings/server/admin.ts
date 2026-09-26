import { supabaseAdmin, toRecord, toRecords } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

export async function getAllDemoBookings() {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}

export async function updateDemoBookingStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Demo booking not found", 404);
  return ok(toRecord(data));
}

export async function deleteDemoBooking(id: string) {
  const { error, count } = await supabaseAdmin
    .from("demo_bookings")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Demo booking not found", 404);
  return ok({ message: "Demo booking deleted" });
}
