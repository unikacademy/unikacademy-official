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
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title.trim();
    if (body.type !== undefined) update.type = body.type.trim();
    if (body.workMode !== undefined) update.work_mode = body.workMode.trim();
    if (body.responsibilities !== undefined)
      update.responsibilities = body.responsibilities.filter((r: string) => r.trim());
    if (body.eligibility !== undefined)
      update.eligibility = body.eligibility.filter((e: string) => e.trim());
    if (body.isActive !== undefined) update.is_active = body.isActive;

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return err("Job not found", 404);
    return ok(toRecord(data));
  }, "update job");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const { error, count } = await supabaseAdmin
      .from("jobs")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error || count === 0) return err("Job not found", 404);
    return ok({ message: "Job deleted" });
  }, "delete job");
}
