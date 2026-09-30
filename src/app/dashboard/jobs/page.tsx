import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { JobsPanel } from "@/modules/jobs/components/JobsPanel";

export default async function JobsPage() {
  const user = await requirePagePermission("jobs:read");
  return <JobsPanel canManage={can(user, "jobs:manage")} />;
}
