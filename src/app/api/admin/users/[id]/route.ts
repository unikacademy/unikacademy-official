import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { authorize } from "@/modules/auth/server/session";
import { setUserRoles } from "@/modules/users/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, denied } = await authorize("users:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(() => setUserRoles(user, id, body.roles), "update user roles");
}
