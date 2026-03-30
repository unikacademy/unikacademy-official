import Contact from "@/models/Contact";
import { ok } from "@/lib/api";

export async function getAllContacts() {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return ok(contacts);
}
