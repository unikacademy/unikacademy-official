import { can, type Permission, type RoleId } from "@/modules/auth/permissions";
import type { NavIconKey } from "@/modules/dashboard/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
  group: string;
  // Omitted = visible to every logged-in user
  permission?: Permission;
};

// Single list of dashboard pages. The sidebar shows only the items the user
// has permission for; each page also guards itself server-side.
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview", group: "General" },
  {
    href: "/dashboard/contacts",
    label: "Contact Messages",
    icon: "contacts",
    group: "Management",
    permission: "contacts:read",
  },
  {
    href: "/dashboard/demos",
    label: "Demo Bookings",
    icon: "demos",
    group: "Management",
    permission: "demos:read",
  },
  {
    href: "/dashboard/applications",
    label: "Job Applications",
    icon: "applications",
    group: "Management",
    permission: "applications:read",
  },
  {
    href: "/dashboard/jobs",
    label: "Job Postings",
    icon: "jobs",
    group: "Management",
    permission: "jobs:read",
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
    icon: "courses",
    group: "Management",
    permission: "courses:read",
  },
];

export function navItemsFor(user: { roles: readonly RoleId[] }): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.permission || can(user, item.permission));
}
