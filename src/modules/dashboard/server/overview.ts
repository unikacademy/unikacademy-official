import { supabaseAdmin } from "@/lib/supabase-admin";
import { can, type Permission } from "@/modules/auth/permissions";
import type { SessionUser } from "@/modules/auth/server/session";

export type OverviewCard = {
  href: string;
  label: string;
  total: number | null; // null = count failed
  // Optional highlighted sub-count, e.g. "3 unread"
  highlight?: { label: string; value: number | null };
};

type Filter = { column: string; value: string | boolean };

// Row count for a table, optionally filtered by one column. Returns null on
// error so one failing query doesn't break the whole overview.
async function count(table: string, filter?: Filter): Promise<number | null> {
  let query = supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count: n, error } = await query;
  if (error) {
    console.error(`Overview count failed for ${table}:`, error);
    return null;
  }
  return n ?? 0;
}

type CardSpec = {
  permission: Permission;
  href: string;
  label: string;
  table: string;
  highlight?: { label: string; filter: Filter };
};

const UNREAD: Filter = { column: "status", value: "not_read" };
const LIVE: Filter = { column: "is_active", value: true };

// One card per dashboard section; shown only with the section's read permission
const CARDS: CardSpec[] = [
  {
    permission: "contacts:read",
    href: "/dashboard/contacts",
    label: "Contact Messages",
    table: "contacts",
    highlight: { label: "unread", filter: UNREAD },
  },
  {
    permission: "demos:read",
    href: "/dashboard/demos",
    label: "Demo Bookings",
    table: "demo_bookings",
    highlight: { label: "unread", filter: UNREAD },
  },
  {
    permission: "applications:read",
    href: "/dashboard/applications",
    label: "Job Applications",
    table: "applications",
    highlight: { label: "unread", filter: UNREAD },
  },
  {
    permission: "jobs:read",
    href: "/dashboard/jobs",
    label: "Job Postings",
    table: "jobs",
    highlight: { label: "live", filter: LIVE },
  },
  {
    permission: "courses:read",
    href: "/dashboard/courses",
    label: "Courses",
    table: "courses",
    highlight: { label: "live", filter: LIVE },
  },
  {
    permission: "users:read",
    href: "/dashboard/users",
    label: "Users",
    table: "profiles",
  },
];

async function loadCard(spec: CardSpec): Promise<OverviewCard> {
  const [total, highlighted] = await Promise.all([
    count(spec.table),
    spec.highlight ? count(spec.table, spec.highlight.filter) : null,
  ]);
  return {
    href: spec.href,
    label: spec.label,
    total,
    highlight: spec.highlight
      ? { label: spec.highlight.label, value: highlighted }
      : undefined,
  };
}

/** Stat cards for every section the user can read, loaded in parallel. */
export async function getOverviewCards(
  user: SessionUser,
): Promise<OverviewCard[]> {
  return Promise.all(
    CARDS.filter((c) => can(user, c.permission)).map(loadCard),
  );
}
