// Single source of truth for role-based access. Code elsewhere checks
// permissions via `can()` — never role names — so adding a role is just a new
// entry here. See requirement.md ("Decisions" B and C).

export const ROLES = ["admin", "teacher", "student", "developer"] as const;
export type RoleId = (typeof ROLES)[number];

export const PERMISSIONS = [
  "admin-dashboard:view",
  "contacts:read",
  "contacts:manage",
  "applications:read",
  "applications:manage",
  "demos:read",
  "demos:manage",
  "courses:read",
  "courses:manage",
  "jobs:read",
  "jobs:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<RoleId, readonly Permission[]> = {
  admin: PERMISSIONS,
  teacher: [],
  student: [],
  developer: [], // TBD — see open questions in requirement.md
};

// A user's permissions are the union of all their roles' permissions.
export function can(user: { roles: readonly RoleId[] }, permission: Permission) {
  return user.roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}

// Where to send a user after login (or when they hit /login already logged in).
export function dashboardPathFor(user: { roles: readonly RoleId[] }) {
  return can(user, "admin-dashboard:view") ? "/admin/dashboard" : "/user/dashboard";
}
