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
      .from("applications")
      .update({ status: body.status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return err("Application not found", 404);
    return ok(toRecord(data));
  }, "update application status");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const { error, count } = await supabaseAdmin
      .from("applications")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error || count === 0) return err("Application not found", 404);
    return ok({ message: "Application deleted" });
  }, "delete application");
}
