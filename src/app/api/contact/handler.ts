import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

export async function submitContact(body: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}) {
  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return err("Name, email, and message are required", 400);
  }

  const { error } = await supabaseAdmin
    .from("contacts")
    .insert({ name, email, phone, message });

  if (error) throw error;

  return ok({ message: "Contact form submitted successfully" }, 201);
}
