import { NextRequest } from "next/server";
import { withDB, ok, err } from "@/lib/api";
import { supabaseAdmin, toRecord } from "@/lib/supabase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const { data, error } = await supabaseAdmin
      .from("demo_bookings")
      .update({ status: body.status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return err("Demo booking not found", 404);
    return ok(toRecord(data));
  }, "update demo booking status");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const { error, count } = await supabaseAdmin
      .from("demo_bookings")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error || count === 0) return err("Demo booking not found", 404);
    return ok({ message: "Demo booking deleted" });
  }, "delete demo booking");
}
