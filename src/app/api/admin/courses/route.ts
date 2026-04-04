import { NextRequest } from "next/server";
import { withDB, ok, err } from "@/lib/api";
import { supabaseAdmin, toRecords, toRecord } from "@/lib/supabase-admin";

export async function GET() {
  return withDB(async () => {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("category")
      .order("order")
      .order("created_at");

    if (error) throw error;
    return ok(toRecords(data ?? []));
  }, "fetch all courses");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(async () => {
    const { title, description, category, iconKey, price, features, featured, order, isActive } = body;

    if (!title?.trim() || !description?.trim() || !category) {
      return err("title, description, and category are required", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert({
        title: title.trim(),
        description: description.trim(),
        category,
        icon_key: iconKey ?? "default",
        price: price?.trim() ?? "",
        features: (features ?? []).filter((f: string) => f.trim()),
        featured: featured ?? false,
        order: order ?? 0,
        is_active: isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return ok(toRecord(data), 201);
  }, "create course");
}
