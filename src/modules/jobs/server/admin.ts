import { ok, err } from "@/lib/api";
import { supabaseAdmin, toRecord, toRecords } from "@/lib/supabase-admin";

export async function listJobs() {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok(toRecords(data ?? []));
}

export async function createJob(body: {
  title?: string;
  type?: string;
  workMode?: string;
  responsibilities?: string[];
  eligibility?: string[];
  isActive?: boolean;
}) {
  const { title, type, workMode, responsibilities, eligibility, isActive } =
    body;

  if (!title?.trim() || !type?.trim() || !workMode?.trim()) {
    return err("title, type, and workMode are required", 400);
  }

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      title: title.trim(),
      type: type.trim(),
      work_mode: workMode.trim(),
      responsibilities: (responsibilities ?? []).filter((r: string) =>
        r.trim(),
      ),
      eligibility: (eligibility ?? []).filter((e: string) => e.trim()),
      is_active: isActive ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return ok(toRecord(data), 201);
}

export async function updateJob(id: string, body: Record<string, unknown>) {
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = (body.title as string).trim();
  if (body.type !== undefined) update.type = (body.type as string).trim();
  if (body.workMode !== undefined)
    update.work_mode = (body.workMode as string).trim();
  if (body.responsibilities !== undefined)
    update.responsibilities = (body.responsibilities as string[]).filter(
      (r: string) => r.trim(),
    );
  if (body.eligibility !== undefined)
    update.eligibility = (body.eligibility as string[]).filter((e: string) =>
      e.trim(),
    );
  if (body.isActive !== undefined) update.is_active = body.isActive;

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Job not found", 404);
  return ok(toRecord(data));
}

export async function deleteJob(id: string) {
  const { error, count } = await supabaseAdmin
    .from("jobs")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Job not found", 404);
  return ok({ message: "Job deleted" });
}
