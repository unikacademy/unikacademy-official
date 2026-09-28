import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { getAllContacts } from "@/modules/contacts/server/admin";

export async function GET() {
  const denied = await requirePermission("contacts:read");
  if (denied) return denied;

  return withDB(() => getAllContacts(), "fetch contacts");
}
