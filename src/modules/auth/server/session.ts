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
  // From the user's profile (editable on My Profile), falling back to the
  // Google/GitHub login values
  fullName: string | null;
  avatarUrl: string | null;
  // The Google/GitHub picture — what "Remove photo" reverts to
  loginAvatarUrl: string | null;
  roles: RoleId[];
};

// Wrapped in `cache` so a layout and page rendering in the same request share
// one auth check + roles/profile query.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [roles, { data: profile }] = await Promise.all([
    fetchUserRoles(supabase, user.id),
    // RLS lets users read their own profile row
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const meta = user.user_metadata ?? {};
  const loginAvatarUrl: string | null = meta.avatar_url ?? meta.picture ?? null;
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? meta.full_name ?? meta.name ?? null,
    avatarUrl: profile?.avatar_url ?? loginAvatarUrl,
    loginAvatarUrl,
    roles,
  };
});

/**
 * API guard for endpoints any logged-in user may call (e.g. their own
 * profile). Returns the user, or a 401 response to send back.
 */
export async function authenticate(): Promise<
  { user: SessionUser; denied: null } | { user: null; denied: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) return { user: null, denied: err("Unauthorized", 401) };
  return { user, denied: null };
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

/**
 * Like requirePermission, but also returns the user for handlers that need
 * to know who is calling:
 *
 *   const { user, denied } = await authorize("users:manage");
 *   if (denied) return denied;
 */
export async function authorize(
  permission: Permission,
): Promise<
  { user: SessionUser; denied: null } | { user: null; denied: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) return { user: null, denied: err("Unauthorized", 401) };
  if (!can(user, permission))
    return { user: null, denied: err("Forbidden", 403) };
  return { user, denied: null };
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
