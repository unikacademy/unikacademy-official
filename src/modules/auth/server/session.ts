import type { NextResponse } from "next/server";
import { err } from "@/lib/api";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { can, type Permission, type RoleId } from "@/modules/auth/permissions";
import { fetchUserRoles } from "@/modules/auth/server/roles";

export type SessionUser = {
  id: string;
  email: string | null;
  roles: RoleId[];
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const roles = await fetchUserRoles(supabase, user.id);
  return { id: user.id, email: user.email ?? null, roles };
}

/**
 * API guard. Returns an error response to send back if the caller is not
 * allowed, or `null` if they are:
 *
 *   const denied = await requirePermission("contacts:read");
 *   if (denied) return denied;
 */
export async function requirePermission(
  permission: Permission,
): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) return err("Unauthorized", 401);
  if (!can(user, permission)) return err("Forbidden", 403);
  return null;
}
