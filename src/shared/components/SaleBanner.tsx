"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import GarbaDancer from "./GarbaDancer";

// Change these to run a different offer — the banner text updates everywhere.
const OFFER_LABEL = "Navratri Special";
const OFFER_PERCENT = 10;
// Offer is valid through the end of 20 Oct (IST). The banner hides itself after.
const OFFER_ENDS_AT = new Date("2026-10-20T23:59:59+05:30").getTime();

const BANNER_KEY = "sale_banner_dismissed";

const listeners = new Set<() => void>();
let dismissedInMemory = false;

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function isDismissed() {
  if (dismissedInMemory) return true;
  try {
    return sessionStorage.getItem(BANNER_KEY) === "1";
  } catch {
    return false;
  }
}

// Ticks once a second. The snapshot is floored to the second so it stays stable
// between reads within the same tick.
function subscribeToClock(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getNowSecond() {
  return Math.floor(Date.now() / 1000) * 1000;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Countdown({ msLeft }: { msLeft: number }) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const parts = [
    { value: Math.floor(total / 86400), label: "Days" },
    { value: Math.floor((total % 86400) / 3600), label: "Hrs" },
    { value: Math.floor((total % 3600) / 60), label: "Min" },
    { value: total % 60, label: "Sec" },
  ];

  return (
    <div
      role="timer"
      aria-label="Time left for the offer"
      className="flex flex-shrink-0 items-center gap-1.5"
    >
      <span className="mr-0.5 text-xs font-semibold tracking-wide text-white/80">
        Ends in
      </span>
      {parts.map((p) => (
        <span
          key={p.label}
          className="flex min-w-9 flex-col items-center rounded-md bg-black/30 px-1.5 py-0.5 ring-1 ring-[#fbbf24]/40"
        >
          <span className="text-sm font-extrabold leading-tight tabular-nums text-[#fde68a]">
            {pad(p.value)}
          </span>
          <span className="text-[9px] font-medium uppercase leading-none text-white/70">
            {p.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function SaleBanner() {
  // Server snapshot is "dismissed" so the banner never flashes before hydration.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const now = useSyncExternalStore(subscribeToClock, getNowSecond, () => 0);
  const msLeft = OFFER_ENDS_AT - now;
  const visible = !dismissed && msLeft > 0;

  function dismiss() {
    dismissedInMemory = true;
    try {
      sessionStorage.setItem(BANNER_KEY, "1");
    } catch {
      // storage blocked — stays dismissed for this page load only
    }
    listeners.forEach((l) => l());
  }

  if (!visible) return null;

  return (
    <div
      className="navratri-banner relative z-50 w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #7f1d1d 0%, #9a3412 30%, #b45309 50%, #9a3412 70%, #7f1d1d 100%)",
        borderBottom: "1px solid rgba(251,191,36,0.5)",
      }}
    >
      {/* Slow golden shimmer sweep */}
      <div
        aria-hidden
        className="navratri-shimmer pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(253,224,71,0.18) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      <div className="relative flex items-center justify-center gap-3 px-10 py-2 sm:gap-5 sm:py-1.5">
        <span className="hidden sm:inline-flex">
          <GarbaDancer variant="girl" />
        </span>

        {/* Message + countdown: stacked on small screens, side by side on md+ */}
        <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-5">
          <p className="text-center text-sm leading-snug text-white sm:text-base">
            <span className="font-bold tracking-wide text-[#fde68a]">
              🌺 {OFFER_LABEL}
            </span>
            <span className="mx-2 text-white/50">—</span>
            {"Celebrate with "}
            <span className="mx-0.5 inline-block rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fde68a] px-2.5 py-0.5 text-sm font-extrabold text-[#7f1d1d] shadow-[0_0_14px_rgba(253,224,71,0.6)] sm:text-base">
              {OFFER_PERCENT}% OFF
            </span>
            {" on all courses."}
          </p>
          <Countdown msLeft={msLeft} />
        </div>

        {/* CTA */}
        <Link
          href="/enroll"
          className="hidden flex-shrink-0 items-center gap-1.5 rounded-full bg-[#0e2b49] px-4 py-1.5 text-xs font-bold text-[#fde68a] shadow-[0_2px_12px_rgba(0,0,0,0.35)] ring-1 ring-[#fbbf24]/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#133a67] sm:inline-flex"
        >
          Enroll Now
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <span className="hidden sm:inline-flex">
          <GarbaDancer variant="boy" />
        </span>
      </div>

      {/* Marigold garland along the bottom edge */}
      <div
        aria-hidden
        className="h-2.5 w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #fde047 0 2.5px, transparent 3px), radial-gradient(circle at 50% 50%, #f97316 0 5px, transparent 5.5px)",
          backgroundSize: "14px 10px",
        }}
      />

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex-shrink-0 rounded-full p-1 text-white/60 transition-colors duration-150 hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .navratri-shimmer { animation: navratri-shimmer 4s infinite linear; }
          .garba-dancer { transform-origin: 32px 84px; animation: garba-bounce 0.9s infinite ease-in-out; }
          .garba-dancer-alt { animation-delay: 0.45s; }
          .garba-arm { transform-origin: 24px 42px; animation: garba-arm 0.45s infinite ease-in-out alternate; }
          .garba-braid { transform-origin: 44px 22px; animation: garba-arm 0.9s infinite ease-in-out alternate; }
        }
        @keyframes navratri-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes garba-bounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes garba-arm {
          from { transform: rotate(-12deg); }
          to { transform: rotate(12deg); }
        }
      `}</style>
    </div>
  );
}
