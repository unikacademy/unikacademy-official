import type { SupabaseClient } from "@supabase/supabase-js";
import { ROLES, type RoleId } from "@/modules/auth/permissions";

// Reads the user's roles from `user_roles`. Pass a client acting as that user
// (RLS only lets users read their own rows). On error, returns no roles so the
// user gets the least access rather than a crash.
export async function fetchUserRoles(
  supabase: SupabaseClient,
  userId: string,
): Promise<RoleId[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to load user roles:", error);
    return [];
  }

  // Ignore roles that exist in the DB but not yet in code
  return data
    .map((row) => row.role_id as string)
    .filter((role): role is RoleId => (ROLES as readonly string[]).includes(role));
}
