import { supabaseAdmin } from "@/lib/supabase-admin";
import { SESSION_FORMATS, COURSE_PRICES, charmPrice } from "@/lib/constants";

// Server-only. Merges the admin-editable `courses` table prices into the
// SESSION_FORMATS display data (badges, perks, colors stay static — only the
// price number is sourced live), so editing a course's price in the admin
// dashboard is reflected on the course detail, enroll, and terms pages, not
// just the homepage carousel.

type FormatId = "1-on-1";

// Deliberately wider than `typeof SESSION_FORMATS[number]` — that type's
// `price` field is narrowed to the literal value by `as const`.
export interface SessionFormatItem {
  id: FormatId;
  label: string;
  price: string;
  badge: string;
  badgeColor: string;
  highlight: boolean;
  perks: readonly string[];
}

type FourWeekLevel = "basic" | "intermediate" | "advanced";

// The 4-week courses are priced individually (Basic / Intermediate / Advanced
// Communication rows in the `pricing` category), not per session format.
const FOUR_WEEK_LEVEL_BY_SLUG: Record<string, FourWeekLevel> = {
  "basic-communication": "basic",
  "communication-skills-intermediate": "intermediate",
  "communication-skills-advanced": "advanced",
};

interface CourseRow {
  title: string;
  category: string;
  price: string;
}

function formatPrice(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `₹${charmPrice(digits)}`;
}

function matchFourWeekLevel(title: string): FourWeekLevel | null {
  const t = title.toLowerCase();
  if (t.includes("basic")) return "basic";
  if (t.includes("intermediate")) return "intermediate";
  if (t.includes("advanced")) return "advanced";
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

export interface LiveSessionPricing {
  sessionFormats: SessionFormatItem[];
  fourWeekPrices: Record<FourWeekLevel, string>;
}

export async function getLiveSessionPricing(): Promise<LiveSessionPricing> {
  const rows = await fetchActiveCourses();

  // 12-week courses: the "1-on-1" row in the `premium` category.
  const livePrice = rows
    .filter((r) => r.category === "premium" && /1[\s-]*(?:on|to)[\s-]*1\b/i.test(r.title))
    .map((r) => formatPrice(r.price))
    .find(Boolean);
  const sessionFormats: SessionFormatItem[] = SESSION_FORMATS.map((f) => ({
    ...f,
    price: livePrice ?? f.price,
  }));

  const fourWeekPrices: Record<FourWeekLevel, string> = {
    basic: `₹${charmPrice(COURSE_PRICES.basic)}`,
    intermediate: `₹${charmPrice(COURSE_PRICES.intermediate)}`,
    advanced: `₹${charmPrice(COURSE_PRICES.advanced)}`,
  };
  for (const row of rows) {
    if (row.category !== "pricing") continue;
    const level = matchFourWeekLevel(row.title);
    const price = level && formatPrice(row.price);
    if (level && price) fourWeekPrices[level] = price;
  }

  return { sessionFormats, fourWeekPrices };
}

// Formats shown on a course detail page: 4-week courses show their own price
// as the single 1-on-1 option; everything else uses the standard 1-on-1 price.
export function formatsForCourse(
  pricing: LiveSessionPricing,
  courseId: string,
): SessionFormatItem[] {
  const level = FOUR_WEEK_LEVEL_BY_SLUG[courseId];
  if (!level) return pricing.sessionFormats;
  return pricing.sessionFormats.map((f) => ({
    ...f,
    price: pricing.fourWeekPrices[level],
  }));
}
