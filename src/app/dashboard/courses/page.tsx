import { can } from "@/modules/auth/permissions";
import { requirePagePermission } from "@/modules/auth/server/session";
import { CoursesPanel } from "@/modules/courses/components/CoursesPanel";

export default async function CoursesPage() {
  const user = await requirePagePermission("courses:read");
  return <CoursesPanel canManage={can(user, "courses:manage")} />;
}
