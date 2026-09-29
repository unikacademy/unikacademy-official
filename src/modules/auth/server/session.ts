import { cache } from "react";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { err } from "@/lib/api";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { can, type Permission, type RoleId } from "@/modules/auth/permissions";
import { fetchUserRoles } from "@/modules/auth/server/roles";

export type SessionUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  roles: RoleId[];
};

// Wrapped in `cache` so a layout and page rendering in the same request share
// one auth check + roles query.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const roles = await fetchUserRoles(supabase, user.id);
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: meta.full_name ?? meta.name ?? null,
    avatarUrl: meta.avatar_url ?? meta.picture ?? null,
    roles,
  };
});

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

/** Page guard: returns the logged-in user, or redirects to /login. */
export async function requirePageUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Page guard: returns the user if they have `permission`; otherwise redirects
 * (to /login if logged out, to /dashboard if they lack the permission).
 */
export async function requirePagePermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await requirePageUser();
  if (!can(user, permission)) redirect("/dashboard");
  return user;
}
