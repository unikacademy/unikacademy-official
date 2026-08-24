import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  SESSION_FORMATS,
  FOUR_WEEK_SESSION_FORMATS,
  STARTING_FROM_PRICE,
  FOUR_WEEK_STARTING_FROM,
} from "@/lib/constants";

// Server-only. Merges the admin-editable `courses` table prices into the
// SESSION_FORMATS / FOUR_WEEK_SESSION_FORMATS display data (badges, perks,
// colors stay static — only the price number is sourced live), so editing a
// course's price in the admin dashboard is reflected on the course detail,
// enroll, and terms pages, not just the homepage carousel.

type FormatId = "1-on-1" | "1-to-2" | "1-to-5";

// Deliberately wider than `typeof SESSION_FORMATS[number]` — that type's
// `price` field is narrowed to SESSION_FORMATS' own literal values by
// `as const`, which would reject FOUR_WEEK_SESSION_FORMATS' different price
// literals. Both arrays are structurally assignable to this interface.
export interface SessionFormatItem {
  id: FormatId;
  label: string;
  price: string;
  badge: string;
  badgeColor: string;
  highlight: boolean;
  perks: readonly string[];
}

interface CourseRow {
  title: string;
  category: string;
  price: string;
}

function formatPrice(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `₹${Number(digits).toLocaleString("en-IN")}`;
}

// "1-on-1", "1 to 2", "1-on-5 Group" → "1-on-1" | "1-to-2" | "1-to-5"
function matchSessionFormatId(title: string): FormatId | null {
  const m = title.toLowerCase().match(/1[\s-]*(?:on|to)[\s-]*(\d)/);
  if (!m) return null;
  const byDigit: Record<string, FormatId> = {
    "1": "1-on-1",
    "2": "1-to-2",
    "5": "1-to-5",
  };
  return byDigit[m[1]] ?? null;
}

// "Basic/Intermediate/Advanced Communication" fill the same 1-on-1 / 1-to-2 /
// 1-to-5 slots at 4-week pricing (matches the existing COURSE_PRICES mapping
// used as the carousel's fallback data in constants.ts).
function matchFourWeekFormatId(title: string): FormatId | null {
  const t = title.toLowerCase();
  if (t.includes("basic")) return "1-to-5";
  if (t.includes("intermediate")) return "1-to-2";
  if (t.includes("advanced")) return "1-on-1";
  return null;
}

async function fetchActiveCourses(): Promise<CourseRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("title, category, price")
      .eq("is_active", true);
    if (error || !data) return [];
    return data as CourseRow[];
  } catch {
    return [];
  }
}

function applyLivePrices(
  base: readonly SessionFormatItem[],
  rows: CourseRow[],
  category: "premium" | "pricing",
  matchId: (title: string) => FormatId | null,
): SessionFormatItem[] {
  const liveById = new Map<string, string>();
  for (const row of rows) {
    if (row.category !== category) continue;
    const id = matchId(row.title);
    const price = id && formatPrice(row.price);
    if (id && price) liveById.set(id, price);
  }
  return base.map((f) => {
    const live = liveById.get(f.id);
    return live ? { ...f, price: live } : f;
  });
}

function cheapest(formats: SessionFormatItem[], fallback: string): string {
  const nums = formats
    .map((f) => parseInt(f.price.replace(/[₹,]/g, ""), 10))
    .filter((n) => !isNaN(n));
  if (!nums.length) return fallback;
  return `₹${Math.min(...nums).toLocaleString("en-IN")}`;
}

export interface LiveSessionPricing {
  sessionFormats: SessionFormatItem[];
  fourWeekSessionFormats: SessionFormatItem[];
  startingFrom: string;
  fourWeekStartingFrom: string;
}

export async function getLiveSessionPricing(): Promise<LiveSessionPricing> {
  const rows = await fetchActiveCourses();
  const sessionFormats = applyLivePrices(
    SESSION_FORMATS,
    rows,
    "premium",
    matchSessionFormatId,
  );
  const fourWeekSessionFormats = applyLivePrices(
    FOUR_WEEK_SESSION_FORMATS,
    rows,
    "pricing",
    matchFourWeekFormatId,
  );
  return {
    sessionFormats,
    fourWeekSessionFormats,
    startingFrom: cheapest(sessionFormats, STARTING_FROM_PRICE),
    fourWeekStartingFrom: cheapest(
      fourWeekSessionFormats,
      FOUR_WEEK_STARTING_FROM,
    ),
  };
}
