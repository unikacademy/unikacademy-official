import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { getAllApplications } from "@/modules/applications/server/admin";

export async function GET() {
  const denied = await requirePermission("applications:read");
  if (denied) return denied;

  return withDB(() => getAllApplications(), "fetch applications");
}
