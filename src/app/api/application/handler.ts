import Application from "@/models/Application";
import { ok, err } from "@/lib/api";

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

  await new Application({ name, email, phone, position, message }).save();

  return ok({ message: "Application submitted successfully" }, 201);
}
