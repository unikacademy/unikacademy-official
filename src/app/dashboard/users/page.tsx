import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { UsersPanel } from "@/modules/users/components/UsersPanel";

export default async function UsersPage() {
  const user = await requirePagePermission("users:read");
  return (
    <UsersPanel canManage={can(user, "users:manage")} currentUserId={user.id} />
  );
}
