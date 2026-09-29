import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { ContactsPanel } from "@/modules/contacts/components/ContactsPanel";

export default async function ContactsPage() {
  const user = await requirePagePermission("contacts:read");
  return <ContactsPanel canManage={can(user, "contacts:manage")} />;
}
