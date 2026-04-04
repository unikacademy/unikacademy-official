import { NextRequest } from "next/server";
import { withDB, ok, err } from "@/lib/api";
import { supabaseAdmin, toRecords, toRecord } from "@/lib/supabase-admin";

export async function GET() {
  return withDB(async () => {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ok(toRecords(data ?? []));
  }, "fetch all jobs");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(async () => {
    const { title, type, workMode, responsibilities, eligibility, isActive } = body;

    if (!title?.trim() || !type?.trim() || !workMode?.trim()) {
      return err("title, type, and workMode are required", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert({
        title: title.trim(),
        type: type.trim(),
        work_mode: workMode.trim(),
        responsibilities: (responsibilities ?? []).filter((r: string) => r.trim()),
        eligibility: (eligibility ?? []).filter((e: string) => e.trim()),
        is_active: isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return ok(toRecord(data), 201);
  }, "create job");
}
