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

// ─── Session Format Pricing ───────────────────────────────────────────────────
// Change prices here and they update across: course detail page, enroll page, terms page.

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
  {
    id: "1-to-2",
    label: "1-to-2 Sessions",
    price: "₹8,999",
    badge: "Best Value",
    badgeColor: "bg-[#c0a84f] text-[#0e2b49]",
    highlight: false,
    perks: [
      "Peer learning dynamics",
      "Semi-personalised coaching",
      "Collaborative practice",
      "Great for siblings / friends",
    ],
  },
  {
    id: "1-to-5",
    label: "1-to-5 Group",
    price: "₹5,999",
    badge: "Budget Friendly",
    badgeColor: "bg-emerald-100 text-emerald-700",
    highlight: false,
    perks: [
      "Group interaction practice",
      "Affordable pricing",
      "Public speaking exposure",
      "Community learning",
    ],
  },
] as const;

// The lowest session format price — shown as "Starting from" on course pages.
export const STARTING_FROM_PRICE = "₹5,999";

// ─── 4-Week Course Pricing ────────────────────────────────────────────────────
// Used for Basic, Intermediate, and Advanced Communication (4-week duration courses).

export const FOUR_WEEK_SESSION_FORMATS = [
  {
    id: "1-on-1",
    label: "1-on-1 Sessions",
    price: "₹2,999",
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
  {
    id: "1-to-2",
    label: "1-to-2 Sessions",
    price: "₹1,999",
    badge: "Best Value",
    badgeColor: "bg-[#c0a84f] text-[#0e2b49]",
    highlight: false,
    perks: [
      "Peer learning dynamics",
      "Semi-personalised coaching",
      "Collaborative practice",
      "Great for siblings / friends",
    ],
  },
  {
    id: "1-to-5",
    label: "1-to-5 Group",
    price: "₹999",
    badge: "Budget Friendly",
    badgeColor: "bg-emerald-100 text-emerald-700",
    highlight: false,
    perks: [
      "Group interaction practice",
      "Affordable pricing",
      "Public speaking exposure",
      "Community learning",
    ],
  },
] as const;

export const FOUR_WEEK_STARTING_FROM = "₹999";

// ─── Course Prices ────────────────────────────────────────────────────────────
// Fallback prices used in the hero carousel when Supabase has no data.

export const COURSE_PRICES = {
  basic: "999",
  intermediate: "1999",
  advanced: "2999",
  group1on5: "5999",
  group1on2: "8999",
  private1on1: "11999",
} as const;

// ─── Demo Session ─────────────────────────────────────────────────────────────
// Strikethrough "original" price shown on the free demo pages.

export const DEMO_ORIGINAL_PRICE = "₹499";
