import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { getAllDemoBookings } from "@/modules/demo-bookings/server/admin";

export async function GET() {
  const denied = await requirePermission("demos:read");
  if (denied) return denied;

  return withDB(() => getAllDemoBookings(), "fetch demo bookings");
}
