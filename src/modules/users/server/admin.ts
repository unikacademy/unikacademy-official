import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";
import { ROLES, type RoleId } from "@/modules/auth/permissions";
import type { SessionUser } from "@/modules/auth/server/session";
import type { UserWithRoles } from "@/modules/users/types";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  user_roles: { role_id: string }[];
};

function toUser(row: ProfileRow): UserWithRoles {
  return {
    _id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    roles: row.user_roles
      .map((r) => r.role_id)
      .filter((r): r is RoleId => (ROLES as readonly string[]).includes(r)),
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const USER_SELECT =
  "id, email, full_name, avatar_url, created_at, user_roles(role_id)";

export async function listUsers() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(USER_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok((data as ProfileRow[]).map(toUser));
}

/**
 * Replace a user's roles with `roles`. Guards against locking everyone out:
 * an admin can't remove their own admin role, and the last admin can't lose it.
 */
export async function setUserRoles(
  actor: SessionUser,
  userId: string,
  roles: unknown,
) {
  if (!UUID_RE.test(userId)) return err("User not found", 404);
  if (
    !Array.isArray(roles) ||
    !roles.every((r) => (ROLES as readonly string[]).includes(r))
  ) {
    return err(`roles must be an array of: ${ROLES.join(", ")}`, 400);
  }
  const nextRoles = [...new Set(roles as RoleId[])];

  const { data: current, error: currentError } = await supabaseAdmin
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);
  if (currentError) throw currentError;

  const currentRoles = (current ?? []).map((r) => r.role_id as string);
  const removingAdmin =
    currentRoles.includes("admin") && !nextRoles.includes("admin");

  if (removingAdmin) {
    if (userId === actor.id) {
      return err("You can't remove your own admin role", 400);
    }
    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role_id", "admin");
    if (countError) throw countError;
    if ((count ?? 0) <= 1) {
      return err("Can't remove the last admin", 400);
    }
  }

  const toRemove = currentRoles.filter((r) => !nextRoles.includes(r as RoleId));
  const toAdd = nextRoles.filter((r) => !currentRoles.includes(r));

  if (toRemove.length) {
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .in("role_id", toRemove);
    if (error) throw error;
  }

  if (toAdd.length) {
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert(toAdd.map((role_id) => ({ user_id: userId, role_id })));
    if (error) {
      // FK violation = no profile with this id
      if (error.code === "23503") return err("User not found", 404);
      throw error;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(USER_SELECT)
    .eq("id", userId)
    .single();

  if (error || !data) return err("User not found", 404);
  return ok(toUser(data as ProfileRow));
}
