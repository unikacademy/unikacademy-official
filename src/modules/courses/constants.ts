// ─── MRP Uplift ───────────────────────────────────────────────────────────────
// The amount added on top of the actual price to show as the strikethrough MRP.
// Change this one number to adjust the "was" price markup everywhere.

export const MRP_UPLIFT = 1000;

// Computes the strikethrough MRP from an actual price string.
// Works with "₹14,999" display format and "14999" raw format (COURSE_PRICES).
export function computeMRP(price: string): string {
  const hasSymbol = price.includes("₹");
  const num = parseInt(price.replace(/[₹,]/g, ""), 10);
  if (isNaN(num)) return price;
  const mrp = (num + MRP_UPLIFT).toLocaleString("en-IN");
  return hasSymbol ? `₹${mrp}` : mrp;
}

// Charm pricing: a round-thousand price from the admin dashboard (e.g. "6000")
// is displayed one rupee lower ("5,999"). Used by the homepage AND the course
// detail / enroll / terms pages so every page shows the same number.
export function charmPrice(price: string): string {
  const num = parseInt(price.replace(/,/g, ""), 10);
  if (isNaN(num)) return price;
  const charmed = num > 0 && num % 1000 === 0 ? num - 1 : num;
  return charmed.toLocaleString("en-IN");
}

// ─── Course Prices ────────────────────────────────────────────────────────────
// We sell 4 courses, each as live 1-on-1 sessions. These are the fallback
// prices used when Supabase has no (or an unreachable) price row for a course;
// the admin-editable `courses` table price overrides them (see lib/pricing.ts).
// Keyed by course detail-page slug.

export const COURSE_PRICES = {
  "communication-skills": "14999",
  "public-speaking": "14999",
  "spoken-english-grammar": "14999",
  "personality-development": "19999",
} as const;

// ─── 1-on-1 Session Format ────────────────────────────────────────────────────
// Display data (label, badge, perks) for the single session format. The price
// is filled in per course by lib/pricing.ts — this value is only a placeholder.

export const SESSION_FORMATS = [
  {
    id: "1-on-1",
    label: "1-on-1 Sessions",
    price: `₹${charmPrice(COURSE_PRICES["communication-skills"])}`,
    badge: "Most Personalized",
    badgeColor: "bg-[#0e2b49] text-white",
    highlight: true,
    perks: [
      "100% dedicated attention",
      "Customised learning pace",
      "Flexible scheduling",
      "Fastest results",
    ],
  },
] as const;

// ─── Demo Session ─────────────────────────────────────────────────────────────
// Strikethrough "original" price shown on the free demo pages.

export const DEMO_ORIGINAL_PRICE = "₹499";
