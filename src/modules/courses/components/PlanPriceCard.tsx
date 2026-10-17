"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, DEFAULT_PLAN, type PlanId } from "@/modules/courses/constants";
import { priceDisplay } from "@/modules/courses/offer";

interface Props {
  courseTitle: string;
  /** Display price of each plan, e.g. { "30-day": "₹7,499", "12-week": "₹14,999" }. */
  prices: Record<PlanId, string>;
  /** Festive offer on? Decided on the server (see modules/courses/offer.ts). */
  offerActive: boolean;
}

/**
 * Sidebar price block of the course detail page: plan toggle, the chosen
 * plan's price, and the Enroll / Demo buttons (also repeated as the fixed
 * mobile bar). Enroll carries the chosen plan so the form opens on it.
 */
export default function PlanPriceCard({ courseTitle, prices, offerActive }: Props) {
  const [planId, setPlanId] = useState<PlanId>(DEFAULT_PLAN);
  const plan = PLANS.find((p) => p.id === planId)!;
  const shown = priceDisplay(prices[planId], offerActive);
  const enrollHref = `/enroll?course=${encodeURIComponent(courseTitle)}&plan=${planId}`;

  return (
    <>
      <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] px-5 pt-5 pb-6">
        <div
          role="tablist"
          aria-label="Choose your plan"
          className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-xl bg-white/10"
        >
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={planId === p.id}
              onClick={() => setPlanId(p.id)}
              className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                planId === p.id
                  ? "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {p.duration}
            </button>
          ))}
        </div>

        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1.5">
          {plan.label} · {plan.badge}
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-white/40 text-sm line-through tabular-nums">
            {shown.was}
          </span>
          <span
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {shown.now}
          </span>
          {shown.offPercent > 0 && (
            <span className="self-center rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fde68a] px-2 py-0.5 text-[10px] font-extrabold text-[#7f1d1d]">
              {shown.offPercent}% OFF
            </span>
          )}
        </div>
        <p className="text-[#c0a84f] text-xs font-medium">
          Live 1-on-1 sessions · {plan.totalSessions} sessions × {plan.sessionDuration}
        </p>
      </div>

      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <p className="text-[#475569] text-xs leading-relaxed">{plan.summary}</p>
      </div>

      <div className="p-5 space-y-3">
        <Link
          href={enrollHref}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] hover:-translate-y-0.5 cursor-pointer text-sm"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Enroll Now
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
        <Link
          href="/demo"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-[#0e2b49] border-2 border-[#0e2b49] hover:bg-[#0e2b49] hover:text-white transition-all duration-200 cursor-pointer text-sm"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Book Free Demo First
        </Link>
      </div>

      {/* Mobile CTA — fixed bar, only on small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 flex gap-3">
        <Link
          href="/demo"
          className="flex-1 py-3 rounded-xl font-semibold text-[#0e2b49] border-2 border-[#0e2b49] text-sm text-center hover:bg-[#0e2b49] hover:text-white transition-all duration-200 cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Free Demo
        </Link>
        <Link
          href={enrollHref}
          className="flex-1 py-3 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-sm text-center shadow-md cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Enroll Now · {shown.now}
        </Link>
      </div>
    </>
  );
}
