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
  "demos:assign", // link student, assign teacher, schedule, Meet link, stage
  "courses:read",
  "courses:manage",
  "jobs:read",
  "jobs:manage",
  "users:read",
  "users:manage",
  // Personal views — only for people who actually teach / study, so they're
  // not part of admin's "everything"
  "demos:read:assigned", // teacher: demos assigned to me
  "demos:read:own", // student: my own demo bookings
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const PERSONAL_PERMISSIONS: readonly Permission[] = [
  "demos:read:assigned",
  "demos:read:own",
];

// Everything across the academy (excludes the personal views)
const ALL_ADMIN_PERMISSIONS = PERMISSIONS.filter(
  (p) => !PERSONAL_PERMISSIONS.includes(p),
);

// Everything an admin can see, without the ability to change anything
const READ_ONLY_PERMISSIONS = ALL_ADMIN_PERMISSIONS.filter((p) =>
  p.endsWith(":read"),
);

export const ROLE_PERMISSIONS: Record<RoleId, readonly Permission[]> = {
  admin: ALL_ADMIN_PERMISSIONS,
  teacher: ["demos:read:assigned"],
  student: ["demos:read:own"],
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
