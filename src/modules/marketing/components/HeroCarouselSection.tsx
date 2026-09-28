"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { CourseIcon } from "@/modules/courses/icons";
import DemoBookingForm from "@/modules/demo-bookings/components/DemoBookingForm";
import { COURSE_PRICES, computeMRP, charmPrice } from "@/modules/courses/constants";

const HeroScene = dynamic(() => import("./hero/HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface Course {
  title: string;
  description?: string;
  price: string;
  features: string[];
  iconKey: string;
}

interface Props {
  courses: Course[];
}

const FALLBACK: Course[] = [
  {
    title: "Communication Skills",
    price: COURSE_PRICES["communication-skills"],
    description:
      "Build clear, confident communication for personal and professional life.",
    features: ["60 Live sessions", "Exclusive 1-on-1", "Certificate"],
    iconKey: "chat",
  },
  {
    title: "Public Speaking & Presentation",
    price: COURSE_PRICES["public-speaking"],
    description:
      "Overcome stage fear and deliver powerful speeches and presentations.",
    features: ["60 Live sessions", "Exclusive 1-on-1", "Certificate"],
    iconKey: "microphone",
  },
  {
    title: "Spoken English & Grammar",
    price: COURSE_PRICES["spoken-english-grammar"],
    description:
      "Speak fluent English with correct grammar, step by step.",
    features: ["60 Live sessions", "Exclusive 1-on-1", "Certificate"],
    iconKey: "chart",
  },
  {
    title: "Personality Development",
    price: COURSE_PRICES["personality-development"],
    description:
      "Transform your presence, confidence and leadership skills.",
    features: ["60 Live sessions", "Exclusive 1-on-1", "Certificate"],
    iconKey: "star",
  },
];

const INTERVAL = 4000;

export default function HeroCarouselSection({ courses }: Props) {
  const slides = courses.length > 0 ? courses : FALLBACK;
  const displaySlides = [...slides, slides[0]];

  const [current, setCurrent] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    pausedRef.current = paused;

    function tick(ts: number) {
      if (pausedRef.current) {
        startRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      progressRef.current = pct;
      setProgress(pct);
      if (elapsed >= INTERVAL) {
        startRef.current = null;
        setCurrent((c) => c + 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, reducedMotion]);

  function handleTransitionEnd() {
    if (current === slides.length) {
      setIsJumping(true);
      setCurrent(0);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsJumping(false)),
      );
    }
  }

  const realIndex = current % slides.length;

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        overflowX: "hidden",
        background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1a30 100%)",
      }}
    >
      {/* 3D Canvas */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,168,79,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(19,58,103,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* ── CAROUSEL — glassy lighter navy card ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseEnter={() => { setPaused(true); pausedRef.current = true; }}
            onMouseLeave={() => { setPaused(false); pausedRef.current = false; }}
          >
            {/* Label */}
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(192,168,79,0.12)",
                  border: "1px solid rgba(192,168,79,0.25)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
                <span className="text-[#c0a84f] text-xs font-semibold uppercase tracking-widest">
                  Our Courses
                </span>
              </div>
              <span className="text-white/30 text-xs font-mono">
                {realIndex + 1} / {slides.length}
              </span>
            </motion.div>

            {/* Card — lighter navy glassy (like the stat boxes in the reference) */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Gold top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(192,168,79,0.7), transparent)",
                }}
              />

              {/* Slide track */}
              <div
                onTransitionEnd={handleTransitionEnd}
                style={{
                  display: "flex",
                  transform: `translateX(-${current * 100}%)`,
                  willChange: "transform",
                  transition:
                    reducedMotion || isJumping
                      ? "none"
                      : "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {displaySlides.map((slide, i) => (
                  <Link key={i} href="/demo" style={{ minWidth: "100%", display: "block" }} className="group/card px-6 py-8 sm:px-10 sm:py-10 cursor-pointer">
                    {/* Top row: icon + price */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-2xl animate-pulse"
                          style={{
                            background: "radial-gradient(circle, rgba(192,168,79,0.3) 0%, transparent 70%)",
                            filter: "blur(8px)",
                            transform: "scale(1.4)",
                          }}
                        />
                        <div
                          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                            boxShadow: "0 8px 32px rgba(192,168,79,0.4)",
                          }}
                        >
                          <CourseIcon iconKey={slide.iconKey} className="w-7 h-7 sm:w-8 sm:h-8 text-[#0e2b49]" />
                        </div>
                      </div>

                      {slide.price && (
                        <div className="text-right">
                          <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">
                            Starting at
                          </div>
                          <div className="text-white/40 text-xs line-through tabular-nums">
                            ₹{computeMRP(slide.price)}
                          </div>
                          <div className="font-bold text-xl sm:text-2xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                            ₹{charmPrice(slide.price)}
                          </div>
                          <div className="text-white/30 text-[10px]">/ full course</div>
                        </div>
                      )}
                    </div>

                    <h2
                      className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {slide.title}
                    </h2>

                    {slide.description && (
                      <p className="text-white/50 text-sm leading-relaxed mb-5">
                        {slide.description}
                      </p>
                    )}

                    <ul className="space-y-2 mb-7">
                      {slide.features.slice(0, 3).map((f, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "rgba(192,168,79,0.15)",
                              border: "1px solid rgba(192,168,79,0.3)",
                            }}
                          >
                            <svg className="w-2.5 h-2.5 text-[#c0a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <span className="text-white/65 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className="group relative flex items-center justify-between w-full px-5 py-4 mt-2 transition-all duration-250"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #ffffff",
                        borderRadius: "6px",
                      }}
                    >
                      <span className="text-[#0e2b49] text-sm font-bold tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Enroll Now
                      </span>
                      <svg className="w-4 h-4 text-[#0e2b49] transition-transform duration-200 group-hover/card:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full transition-none"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #c0a84f, #d4bc72)",
                    boxShadow: "0 0 8px rgba(192,168,79,0.6)",
                  }}
                />
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); startRef.current = null; setProgress(0); }}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: realIndex === i ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: realIndex === i ? "linear-gradient(90deg, #c0a84f, #d4bc72)" : "rgba(255,255,255,0.25)",
                    boxShadow: realIndex === i ? "0 0 8px rgba(192,168,79,0.5)" : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── DEMO FORM — solid deeper navy card (like pricing card in reference) ── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Glow aura */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(192,168,79,0.15) 0%, transparent 70%)",
                filter: "blur(32px)",
                transform: "scale(1.1) translateY(8%)",
              }}
            />

            {/* Solid deeper navy card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "#0e2b49",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 80px rgba(192,168,79,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Gold shimmer line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(192,168,79,0.9) 40%, rgba(212,188,114,0.9) 60%, transparent 100%)",
                }}
              />

              <div className="px-7 py-8 sm:px-9 sm:py-10">
                {/* Header */}
                <div className="mb-7">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                    style={{
                      background: "rgba(192,168,79,0.12)",
                      border: "1px solid rgba(192,168,79,0.25)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
                    <span className="text-[#c0a84f] text-[10px] font-semibold uppercase tracking-widest">
                      100% Free · No Card Needed
                    </span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1.5"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Book Your{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Free Demo
                    </span>
                  </h2>
                  <p className="text-white/45 text-sm">30 min · Live session · Expert trainer</p>
                </div>

                <DemoBookingForm variant="dark" idPrefix="hero" />

                {/* Trust row */}
                <div className="flex items-center justify-center gap-4 mt-5">
                  {[["🔒", "Secure"], ["⚡", "Instant"], ["🎯", "Expert"]].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="text-xs">{icon}</span>
                      <span className="text-white/30 text-[11px]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 60L1440 60L1440 20C1320 50 1200 60 1080 50C960 40 840 0 720 0C600 0 480 40 360 50C240 60 120 50 0 20L0 60Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}
