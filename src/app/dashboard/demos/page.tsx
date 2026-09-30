import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { DemoBookingsPanel } from "@/modules/demo-bookings/components/DemoBookingsPanel";

export default async function DemoBookingsPage() {
  const user = await requirePagePermission("demos:read");
  return <DemoBookingsPanel canManage={can(user, "demos:manage")} />;
}
