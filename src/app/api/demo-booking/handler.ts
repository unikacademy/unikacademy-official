import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

export async function submitDemoBooking(body: {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  message?: string;
}) {
  const { name, email, phone, course, message } = body;

  if (!name || !phone || !course) {
    return err("Name, phone, and course are required", 400);
  }

  const { error } = await supabaseAdmin
    .from("demo_bookings")
    .insert({ name, email, phone, course, message });

  if (error) throw error;

  return ok({ message: "Demo booking submitted successfully" }, 201);
}
