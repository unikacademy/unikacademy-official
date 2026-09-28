import type { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { err } from "@/lib/api";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { can, type Permission, type RoleId } from "@/modules/auth/permissions";

export type SessionUser = {
  id: string;
  email: string | null;
  roles: RoleId[];
};

// TEMPORARY (RBAC phase 1, step 1): roles are derived from ADMIN_EMAIL until
// the `user_roles` table exists. Only this function changes when we switch.
function resolveRoles(user: User): RoleId[] {
  const adminEmail = process.env.ADMIN_EMAIL;
  return adminEmail && user.email === adminEmail ? ["admin"] : ["student"];
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return { id: user.id, email: user.email ?? null, roles: resolveRoles(user) };
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
