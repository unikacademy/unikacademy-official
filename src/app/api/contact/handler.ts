import Contact from "@/models/Contact";
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

  await new Contact({ name, email, phone, message }).save();

  return ok({ message: "Contact form submitted successfully" }, 201);
}
