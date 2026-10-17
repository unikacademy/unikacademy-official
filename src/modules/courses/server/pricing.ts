import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  SESSION_FORMATS,
  COURSE_PRICES,
  COURSE_PRICES_30_DAY,
  charmPrice,
  type PlanId,
} from "@/modules/courses/constants";
import { courseDetailsData, getCourseSlug } from "@/modules/courses/data/courseDetails";

// Server-only. Every course has exactly one price: the price on its own row in
// the admin-editable `courses` table (the same row the homepage carousel
// reads), falling back to COURSE_PRICES if the row/DB is unavailable. Editing a
// price in the admin dashboard therefore updates the homepage, course detail,
// enroll and terms pages together.

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

interface CourseRow {
  title: string;
  category: string;
  price: string;
  // Absent until supabase-schema.sql has been re-run, hence optional.
  price_30?: string | null;
}

function formatPrice(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `₹${charmPrice(digits)}`;
}

async function fetchActiveCourses(): Promise<CourseRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("is_active", true);
    if (error || !data) return [];
    return data as CourseRow[];
  } catch {
    return [];
  }
}

// Course-detail slug → display price (e.g. "₹14,999"), for all 4 courses.
export type CoursePrices = Record<string, string>;

// Course slug → price of each plan.
export type CoursePlanPrices = Record<string, Record<PlanId, string>>;

// 12-week prices only — kept for pages that don't deal with plans.
export async function getCoursePrices(): Promise<CoursePrices> {
  return pricesFor("12-week", await fetchActiveCourses());
}

export async function getCoursePlanPrices(): Promise<CoursePlanPrices> {
  const rows = await fetchActiveCourses();
  const twelveWeek = pricesFor("12-week", rows);
  const thirtyDay = pricesFor("30-day", rows);
  const out: CoursePlanPrices = {};
  for (const course of courseDetailsData) {
    out[course.id] = {
      "12-week": twelveWeek[course.id],
      "30-day": thirtyDay[course.id],
    };
  }
  return out;
}

function pricesFor(plan: PlanId, rows: CourseRow[]): CoursePrices {
  const fallbacks: Record<string, string> =
    plan === "30-day" ? COURSE_PRICES_30_DAY : COURSE_PRICES;
  const prices: CoursePrices = {};
  for (const course of courseDetailsData) {
    const fallback = `₹${charmPrice(fallbacks[course.id] ?? "")}`;
    // Price rows live in the `pricing` / `premium` categories; `core` rows
    // (homepage cards) carry no price. Match on the detail page's own lookup so
    // "Public Speaking & Presentation" (DB) ↔ "Public Speaking" (detail) agree.
    const live = rows
      .filter((r) => r.category !== "core")
      .filter((r) => getCourseSlug(r.title) === course.id)
      .map((r) => formatPrice(plan === "30-day" ? (r.price_30 ?? "") : r.price))
      .find(Boolean);
    prices[course.id] = live ?? fallback;
  }
  return prices;
}

// The single 1-on-1 format shown on a course detail page, at that course's price.
export function formatsForCourse(
  prices: CoursePrices,
  courseId: string,
): SessionFormatItem[] {
  return SESSION_FORMATS.map((f) => ({
    ...f,
    price: prices[courseId] ?? f.price,
  }));
}
