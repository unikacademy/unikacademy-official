// ─── MRP Uplift ───────────────────────────────────────────────────────────────
// The amount added on top of the actual price to show as the strikethrough MRP.
// Change this one number to adjust the "was" price markup everywhere.

export const MRP_UPLIFT = 1000;

// Computes the strikethrough MRP from an actual price string.
// Works with "₹11,999" format (SESSION_FORMATS) and "11999" format (COURSE_PRICES).
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

// ─── Session Format Pricing ───────────────────────────────────────────────────
// We only offer 1-on-1 sessions. Change the price here and it updates across:
// course detail page, enroll page, terms page (live DB price overrides it).

export const SESSION_FORMATS = [
  {
    id: "1-on-1",
    label: "1-on-1 Sessions",
    price: "₹11,999",
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

// ─── Course Prices ────────────────────────────────────────────────────────────
// Fallback prices used when Supabase has no data: the 4-week courses on their
// detail pages, and the 1-on-1 slide in the hero carousel.

export const COURSE_PRICES = {
  basic: "999",
  intermediate: "1999",
  advanced: "2999",
  private1on1: "11999",
} as const;

// Group formats (1-on-2, 1-on-5, …) are no longer offered. Old rows may still
// exist in the `courses` table, so the homepage filters them out by title.
export function isRetiredSessionFormat(title: string): boolean {
  return /1[\s-]*(?:on|to)[\s-]*[2-9]/i.test(title);
}

// ─── Demo Session ─────────────────────────────────────────────────────────────
// Strikethrough "original" price shown on the free demo pages.

export const DEMO_ORIGINAL_PRICE = "₹499";
