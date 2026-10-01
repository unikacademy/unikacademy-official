// Single source of truth for role-based access. Code elsewhere checks
// permissions via `can()` — never role names — so adding a role is just a new
// entry here. See requirement.md ("Decisions" B and C).

export const ROLES = ["admin", "teacher", "student", "developer"] as const;
export type RoleId = (typeof ROLES)[number];

export const ROLE_LABELS: Record<RoleId, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  developer: "Developer",
};

export const PERMISSIONS = [
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
  "users:read",
  "users:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

// Everything an admin can see, without the ability to change anything
const READ_ONLY_PERMISSIONS = PERMISSIONS.filter((p) => p.endsWith(":read"));

export const ROLE_PERMISSIONS: Record<RoleId, readonly Permission[]> = {
  admin: PERMISSIONS,
  teacher: [],
  student: [],
  developer: READ_ONLY_PERMISSIONS,
};

// Extra My Profile sections per role (everyone gets the basic section).
// Someone with several roles gets every matching section.
export type ProfileSection = "student" | "teacher";

const ROLE_PROFILE_SECTIONS: Record<RoleId, readonly ProfileSection[]> = {
  admin: [],
  developer: [],
  teacher: ["teacher"],
  student: ["student"],
};

export function profileSectionsFor(user: {
  roles: readonly RoleId[];
}): ProfileSection[] {
  return [
    ...new Set(user.roles.flatMap((r) => ROLE_PROFILE_SECTIONS[r] ?? [])),
  ];
}

// A user's permissions are the union of all their roles' permissions.
export function can(
  user: { roles: readonly RoleId[] },
  permission: Permission,
) {
  return user.roles.some((role) =>
    ROLE_PERMISSIONS[role]?.includes(permission),
  );
}
