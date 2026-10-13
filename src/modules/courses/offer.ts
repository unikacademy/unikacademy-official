import { computeMRP } from "./constants";

// ─── Festive offer — the ONE place to run / change a site-wide discount ──────
// The announcement banner AND every course price read this. To change the
// offer, edit these values only:
//   • percent: 5, 10, 15 … ; set to 0 to switch the offer off entirely
//   • endsAt:  when the offer stops (ISO date; keep the +05:30 for IST)
//   • label:   festival name shown on the banner
// Once `endsAt` passes, prices and the banner return to normal on their own.
export const OFFER = {
  label: "Navratri Special",
  percent: 10,
  endsAt: "2026-10-20T23:59:59+05:30",
} as const;

export const OFFER_ENDS_AT_MS = new Date(OFFER.endsAt).getTime();

export function isOfferActive(now: number = Date.now()): boolean {
  return OFFER.percent > 0 && now < OFFER_ENDS_AT_MS;
}

// Applies the offer to a price string. Keeps the input's format, like
// computeMRP: "₹14,999" → "₹13,499", "14999" → "13,499".
export function discountedPrice(price: string): string {
  const hasSymbol = price.includes("₹");
  const num = parseInt(price.replace(/[₹,]/g, ""), 10);
  if (isNaN(num)) return price;
  const off = Math.round((num * (100 - OFFER.percent)) / 100).toLocaleString("en-IN");
  return hasSymbol ? `₹${off}` : off;
}

// What to render for a course price:
//  • offer on  → struck-through regular price, then the discounted price
//  • offer off → struck-through MRP, then the regular price (as before)
export function priceDisplay(price: string, offerActive: boolean) {
  return offerActive
    ? { was: price, now: discountedPrice(price), offPercent: OFFER.percent }
    : { was: computeMRP(price), now: price, offPercent: 0 };
}
