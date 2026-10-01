import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { listAssignees } from "@/modules/demo-bookings/server/admin";

export async function GET() {
  const denied = await requirePermission("demos:assign");
  if (denied) return denied;

  return withDB(() => listAssignees(), "fetch demo assignees");
}
