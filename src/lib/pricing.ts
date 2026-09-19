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

// 12-week courses that the homepage prices individually (their own row in the
// `courses` table) rather than through the generic "1-on-1" session-format
// row. Keyed by the course detail page's slug → the exact `courses.title` to
// read the price from. Any 12-week course not listed here (e.g. Business
// Communication, which only exists as a priceless `core` row) falls back to
// the generic 1-on-1 price so the detail page and homepage never disagree.
const OWN_PRICE_TITLE_BY_SLUG: Record<string, string> = {
  "communication-skills": "Communication Skills",
  "personality-development": "Personality Development",
  "public-speaking": "Public Speaking & Presentation",
  "spoken-english-grammar": "Spoken English & Grammar",
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
  ownPrices: Record<string, string>;
}

export async function getLiveSessionPricing(): Promise<LiveSessionPricing> {
  const rows = await fetchActiveCourses();

  // Generic 1-on-1 price: the "1-on-1" row in the `premium` category. Used by
  // courses that don't have a dedicated price row of their own.
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

  // 12-week courses priced by their own row (see OWN_PRICE_TITLE_BY_SLUG),
  // keyed by lower-cased title for a case-insensitive lookup below.
  const ownPrices: Record<string, string> = {};
  for (const row of rows) {
    if (row.category === "core") continue;
    const price = formatPrice(row.price);
    if (price) ownPrices[row.title.toLowerCase()] = price;
  }

  return { sessionFormats, fourWeekPrices, ownPrices };
}

// Formats shown on a course detail page: 4-week courses show their own price;
// courses with a dedicated homepage row (OWN_PRICE_TITLE_BY_SLUG) show that
// row's price; everything else falls back to the standard 1-on-1 price. This
// keeps every course detail page in sync with what the homepage displays.
export function formatsForCourse(
  pricing: LiveSessionPricing,
  courseId: string,
): SessionFormatItem[] {
  const fourWeekLevel = FOUR_WEEK_LEVEL_BY_SLUG[courseId];
  if (fourWeekLevel) {
    return pricing.sessionFormats.map((f) => ({
      ...f,
      price: pricing.fourWeekPrices[fourWeekLevel],
    }));
  }

  const ownTitle = OWN_PRICE_TITLE_BY_SLUG[courseId];
  const ownPrice = ownTitle && pricing.ownPrices[ownTitle.toLowerCase()];
  if (ownPrice) {
    return pricing.sessionFormats.map((f) => ({ ...f, price: ownPrice }));
  }

  return pricing.sessionFormats;
}
