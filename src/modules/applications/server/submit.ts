import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";
import { notifyApplicationSubmission } from "./notify";

export async function submitApplication(body: {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  message?: string;
}) {
  const { name, email, phone, position, message } = body;

  if (!name || !email || !phone || !position) {
    return err("Name, email, phone, and position are required", 400);
  }

  const { error } = await supabaseAdmin
    .from("applications")
    .insert({ name, email, phone, position, message });

  if (error) throw error;

  await notifyApplicationSubmission({ name, email, phone, position, message });

  return ok({ message: "Application submitted successfully" }, 201);
}
