"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    word: "Speak",
    headline: "Find Your Voice",
    body: "Break through silence. Say what you mean with clarity, conviction, and confidence that commands attention.",
    num: "01",
    glowPos: "70% 30%",
    bg: "linear-gradient(135deg, #080f1a 0%, #0e2b49 100%)",
  },
  {
    word: "Lead",
    headline: "Command Any Room",
    body: "Boardrooms, stages, conversations — lead with a presence that people feel and never forget.",
    num: "02",
    glowPos: "30% 70%",
    bg: "linear-gradient(135deg, #0e2b49 0%, #133a67 100%)",
  },
  {
    word: "Transform",
    headline: "Become Unstoppable",
    body: "From hesitant to magnetic. Join 500+ students who've completely rewritten their story.",
    num: "03",
    glowPos: "50% 30%",
    bg: "linear-gradient(135deg, #06101e 0%, #0a1f38 100%)",
  },
];

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const scrollAmount = track.scrollWidth - window.innerWidth;
      if (scrollAmount <= 0) return;

      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${scrollAmount}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        snap: {
          snapTo: 1 / (PANELS.length - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: "power2.inOut",
        },
        animation: gsap.to(track, {
          x: -scrollAmount,
          ease: "none",
        }),
      });

      return () => st.kill();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-label="Your transformation journey"
      style={{ overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          width: `${PANELS.length * 100}vw`,
          height: "100vh",
        }}
      >
        {PANELS.map((panel, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              width: "100vw",
              height: "100vh",
              background: panel.bg,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at ${panel.glowPos}, rgba(192,168,79,0.14) 0%, transparent 65%)`,
              }}
            />

            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Ghost panel number */}
            <div
              className="absolute top-8 left-8 md:top-12 md:left-12 font-bold leading-none select-none pointer-events-none"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(72px, 14vw, 180px)",
                color: "rgba(255,255,255,0.04)",
              }}
            >
              {panel.num}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
              {/* Massive word */}
              <div
                className="font-bold leading-none mb-5"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(72px, 17vw, 220px)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.93) 0%, #c0a84f 65%, #d4bc72 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {panel.word}
              </div>

              {/* Gold rule */}
              <div className="w-20 h-[2px] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] mx-auto mb-6 rounded-full" />

              <h3
                className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {panel.headline}
              </h3>
              <p className="text-white/50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                {panel.body}
              </p>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {PANELS.map((_, j) => (
                <div
                  key={j}
                  className="rounded-full"
                  style={{
                    width: j === i ? "32px" : "8px",
                    height: "8px",
                    background:
                      j === i
                        ? "linear-gradient(90deg, #c0a84f, #d4bc72)"
                        : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {/* Scroll hint — first panel only */}
            {i === 0 && (
              <div className="absolute bottom-10 right-8 md:right-12 text-white/25 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                Scroll
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
