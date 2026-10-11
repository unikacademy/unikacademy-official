"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

// Change these to run a different offer — the banner text updates everywhere.
const OFFER_LABEL = "Special Offer";
const OFFER_PERCENT = 10;

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

export default function SaleBanner() {
  // Server snapshot is "dismissed" so the banner never flashes before hydration.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const visible = !dismissed;

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
      className="relative z-50 w-full flex items-center justify-center gap-4 px-10 py-4"
      style={{
        background: "linear-gradient(90deg, #0a1f38 0%, #133a67 40%, #0e2b49 60%, #0a1f38 100%)",
        borderBottom: "1px solid rgba(192,168,79,0.25)",
      }}
    >
      {/* Animated shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(192,168,79,0.07) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s infinite linear",
        }}
      />

      {/* Pulse dot */}
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0a84f] opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c0a84f]" />
      </span>

      {/* Message */}
      <p className="text-white/90 text-sm sm:text-base text-center leading-snug">
        <span className="text-[#c0a84f] font-bold tracking-wide">🎉 {OFFER_LABEL}</span>
        <span className="text-white/50 mx-2">—</span>
        {"Limited Time Offer: Get "}
        <span className="text-[#d4bc72] font-extrabold text-base sm:text-lg">{OFFER_PERCENT}% OFF</span>
        {" on all courses."}
        <span className="hidden sm:inline text-white/70"> Enroll today and save more!</span>
      </p>

      {/* CTA */}
      <Link
        href="/enroll"
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 flex-shrink-0 shadow-[0_2px_12px_rgba(192,168,79,0.4)] hover:shadow-[0_4px_18px_rgba(192,168,79,0.55)] hover:-translate-y-0.5"
      >
        Enroll Now
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors duration-150 flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
