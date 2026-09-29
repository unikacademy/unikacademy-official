import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { listUsers } from "@/modules/users/server/admin";

export async function GET() {
  const denied = await requirePermission("users:read");
  if (denied) return denied;

  return withDB(() => listUsers(), "fetch users");
}
