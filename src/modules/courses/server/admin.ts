import { ok, err } from "@/lib/api";
import { supabaseAdmin, toRecord, toRecords } from "@/lib/supabase-admin";

export async function listCourses() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("category")
    .order("order")
    .order("created_at");

  if (error) throw error;
  return ok(toRecords(data ?? []));
}

export async function createCourse(body: {
  title?: string;
  description?: string;
  category?: string;
  iconKey?: string;
  price?: string;
  features?: string[];
  featured?: boolean;
  order?: number;
  isActive?: boolean;
}) {
  const {
    title,
    description,
    category,
    iconKey,
    price,
    features,
    featured,
    order,
    isActive,
  } = body;

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
}

export async function updateCourse(
  id: string,
  body: Record<string, unknown>,
) {
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = (body.title as string).trim();
  if (body.description !== undefined)
    update.description = (body.description as string).trim();
  if (body.category !== undefined) update.category = body.category;
  if (body.iconKey !== undefined) update.icon_key = body.iconKey;
  if (body.price !== undefined) update.price = (body.price as string).trim();
  if (body.features !== undefined)
    update.features = (body.features as string[]).filter((f: string) =>
      f.trim(),
    );
  if (body.featured !== undefined) update.featured = body.featured;
  if (body.order !== undefined) update.order = body.order;
  if (body.isActive !== undefined) update.is_active = body.isActive;

  const { data, error } = await supabaseAdmin
    .from("courses")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Course not found", 404);
  return ok(toRecord(data));
}

export async function deleteCourse(id: string) {
  const { error, count } = await supabaseAdmin
    .from("courses")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Course not found", 404);
  return ok({ message: "Course deleted" });
}
