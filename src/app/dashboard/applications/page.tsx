import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { ApplicationsPanel } from "@/modules/applications/components/ApplicationsPanel";

export default async function ApplicationsPage() {
  const user = await requirePagePermission("applications:read");
  return <ApplicationsPanel canManage={can(user, "applications:manage")} />;
}
