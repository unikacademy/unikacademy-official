"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Diya from "./Diya";
// Offer label / percent / end date live in one place: modules/courses/offer.ts
import { OFFER, OFFER_ENDS_AT_MS, isOfferActive } from "@/modules/courses/offer";

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

// Fixed positions so server and client markup match.
const SPARKLES = [
  { left: "4%", top: "18%", size: "9px", delay: "0s" },
  { left: "13%", top: "62%", size: "7px", delay: "0.8s" },
  { left: "24%", top: "22%", size: "6px", delay: "1.6s" },
  { left: "38%", top: "70%", size: "7px", delay: "0.4s" },
  { left: "61%", top: "16%", size: "6px", delay: "1.2s" },
  { left: "74%", top: "66%", size: "8px", delay: "2s" },
  { left: "86%", top: "24%", size: "7px", delay: "0.6s" },
  { left: "95%", top: "60%", size: "6px", delay: "1.4s" },
];

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
          className="flex min-w-9 flex-col items-center rounded-md bg-black/35 px-1.5 py-0.5 ring-1 ring-[#fbbf24]/40"
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
  const msLeft = OFFER_ENDS_AT_MS - now;
  const visible = !dismissed && isOfferActive(now);

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
      className="diwali-banner relative z-50 w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #1e1b4b 0%, #4c1d95 30%, #6b21a8 50%, #4c1d95 70%, #1e1b4b 100%)",
        borderBottom: "1px solid rgba(251,191,36,0.5)",
      }}
    >
      {/* Slow golden shimmer sweep */}
      <div
        aria-hidden
        className="diwali-shimmer pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(253,224,71,0.16) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Twinkling sparkles in the night sky */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="diwali-sparkle absolute text-[#fde68a]"
            style={{ left: s.left, top: s.top, fontSize: s.size, animationDelay: s.delay }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="relative flex items-center justify-center gap-3 px-10 py-2 sm:gap-5 sm:py-1.5">
        <span className="hidden sm:inline-flex">
          <Diya />
        </span>

        {/* Message + countdown: stacked on small screens, side by side on md+ */}
        <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-5">
          <p className="text-center text-sm leading-snug text-white sm:text-base">
            <span className="font-bold tracking-wide text-[#fde68a]">
              🪔 {OFFER.label}
            </span>
            <span className="mx-2 text-white/50">—</span>
            {"Light up your future with "}
            <span className="mx-0.5 inline-block rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fde68a] px-2.5 py-0.5 text-sm font-extrabold text-[#3b0764] shadow-[0_0_14px_rgba(253,224,71,0.6)] sm:text-base">
              {OFFER.percent}% OFF
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
          <Diya delayed />
        </span>
      </div>

      {/* String of festive lights along the bottom edge */}
      <div
        aria-hidden
        className="diwali-lights h-2.5 w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, #fde047 0 2.5px, transparent 3px), radial-gradient(circle at 75% 50%, #f472b6 0 2.5px, transparent 3px), linear-gradient(transparent 4px, rgba(253,230,138,0.35) 4px 5px, transparent 5px)",
          backgroundSize: "24px 10px",
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
          .diwali-shimmer { animation: diwali-shimmer 4s infinite linear; }
          .diwali-sparkle { animation: diwali-twinkle 2.4s infinite ease-in-out; }
          .diwali-lights { animation: diwali-lights 1.6s infinite steps(2); }
          .diya-flame { transform-origin: 32px 30px; animation: diya-flicker 0.5s infinite ease-in-out alternate; }
          .diya-glow { transform-origin: 32px 20px; animation: diya-pulse 1.8s infinite ease-in-out; }
          .diya-alt .diya-flame { animation-delay: 0.25s; }
          .diya-alt .diya-glow { animation-delay: 0.9s; }
        }
        .diwali-sparkle { opacity: 0.6; line-height: 1; }
        @keyframes diwali-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes diwali-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
        @keyframes diwali-lights {
          from { background-position: 0 0; }
          to { background-position: 12px 0; }
        }
        @keyframes diya-flicker {
          from { transform: scale(1, 1) rotate(-3deg); }
          to { transform: scale(0.92, 1.08) rotate(3deg); }
        }
        @keyframes diya-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
