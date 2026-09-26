import { withDB } from "@/lib/api";
import { getAllContacts } from "@/modules/contacts/server/admin";

export async function GET() {
  return withDB(() => getAllContacts(), "fetch contacts");
}
