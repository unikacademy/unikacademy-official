"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CourseIcon } from "@/lib/courseIcons";
import { validateName, validatePhone } from "@/lib/validation";

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

function charmPrice(price: string): string {
  const num = parseInt(price.replace(/,/g, ""), 10);
  if (!isNaN(num) && num > 0 && num % 1000 === 0) {
    return (num - 1).toLocaleString("en-IN");
  }
  return price;
}

const FALLBACK: Course[] = [
  {
    title: "Basic Communication",
    price: "999",
    description:
      "Perfect for beginners looking to build foundational communication skills.",
    features: ["Core communication basics", "100% Live classes", "Certificate"],
    iconKey: "chat",
  },
  {
    title: "Intermediate Communication",
    price: "1999",
    description:
      "Refine and elevate your communication in professional contexts.",
    features: ["Advanced techniques", "Professional scenarios", "Certificate"],
    iconKey: "briefcase",
  },
  {
    title: "Advanced Communication",
    price: "2999",
    description: "Executive-level mastery for leaders and high-performers.",
    features: ["Executive communication", "Leadership presence", "Certificate"],
    iconKey: "microphone",
  },
  {
    title: "1-on-5 Group Sessions",
    price: "5999",
    description:
      "Interactive group learning with peer engagement and collaborative exercises.",
    features: ["60 Live sessions", "Up to 5 students", "Group activities"],
    iconKey: "chart",
  },
  {
    title: "1-on-2 Small Group",
    price: "8999",
    description:
      "Focused small-group sessions with maximum personalized attention.",
    features: ["60 Live sessions", "2 students", "Personalized focus"],
    iconKey: "star",
  },
  {
    title: "1-on-1 Private Sessions",
    price: "11999",
    description:
      "Fully personalized sessions exclusively dedicated to your growth.",
    features: ["60 Live sessions", "Exclusive 1-on-1", "Custom curriculum"],
    iconKey: "trophy",
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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    }
  }, []);

  // Progress bar animation
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr ?? undefined, phone: phoneErr ?? undefined });
      return;
    }
    setErrors({});
    setFormStatus("loading");
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          course: "Quick Demo Request",
        }),
      });
      if (!res.ok) throw new Error();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-[#080f1a] text-white"
      style={{ overflowX: "hidden" }}
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
            "radial-gradient(circle, rgba(192,168,79,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(19,58,103,0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,168,79,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* ── CAROUSEL ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onMouseEnter={() => {
              setPaused(true);
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              setPaused(false);
              pausedRef.current = false;
            }}
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

            {/* Card viewport */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Animated gradient top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(192,168,79,0.6), transparent)",
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
                  <div
                    key={i}
                    style={{ minWidth: "100%" }}
                    className="px-6 py-8 sm:px-10 sm:py-10"
                  >
                    {/* Top row: icon + price */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Animated icon */}
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-2xl animate-pulse"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(192,168,79,0.3) 0%, transparent 70%)",
                            filter: "blur(8px)",
                            transform: "scale(1.4)",
                          }}
                        />
                        <div
                          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #c0a84f, #d4bc72)",
                            boxShadow: "0 8px 32px rgba(192,168,79,0.4)",
                          }}
                        >
                          <CourseIcon
                            iconKey={slide.iconKey}
                            className="w-7 h-7 sm:w-8 sm:h-8 text-[#0e2b49]"
                          />
                        </div>
                      </div>

                      {/* Price chip */}
                      {slide.price && (
                        <div className="text-right">
                          <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">
                            Starting at
                          </div>
                          <div
                            className="font-bold text-xl sm:text-2xl text-white"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            ₹{charmPrice(slide.price)}
                          </div>
                          <div className="text-white/30 text-[10px]">
                            / full course
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {slide.title}
                    </h2>

                    {/* Description */}
                    {slide.description && (
                      <p className="text-white/50 text-sm leading-relaxed mb-5">
                        {slide.description}
                      </p>
                    )}

                    {/* Features */}
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
                            <svg
                              className="w-2.5 h-2.5 text-[#c0a84f]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          </div>
                          <span className="text-white/65 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/demo"
                      className="group relative flex items-center justify-between w-full px-5 py-4 mt-2 transition-all duration-250"
                      style={{
                        background: "rgba(192,168,79,0.08)",
                        border: "1px solid rgba(192,168,79,0.35)",
                        borderRadius: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(192,168,79,0.18)";
                        e.currentTarget.style.borderColor =
                          "rgba(192,168,79,0.7)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(192,168,79,0.08)";
                        e.currentTarget.style.borderColor =
                          "rgba(192,168,79,0.35)";
                      }}
                    >
                      {/* Corner accents */}
                      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#c0a84f] rounded-tl-sm" />
                      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#c0a84f] rounded-tr-sm" />
                      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#c0a84f] rounded-bl-sm" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#c0a84f] rounded-br-sm" />

                      <span
                        className="text-[#c0a84f] text-sm font-bold tracking-wide"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Enroll Now
                      </span>
                      <svg
                        className="w-4 h-4 text-[#c0a84f] transition-transform duration-200 group-hover:translate-x-1"
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
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
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
                  onClick={() => {
                    setCurrent(i);
                    startRef.current = null;
                    setProgress(0);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: realIndex === i ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background:
                      realIndex === i
                        ? "linear-gradient(90deg, #c0a84f, #d4bc72)"
                        : "rgba(255,255,255,0.2)",
                    boxShadow:
                      realIndex === i ? "0 0 8px rgba(192,168,79,0.5)" : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── FLOATING "ON AIR" FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative"
          >
            {/* Glow aura behind the card */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, rgba(192,168,79,0.18) 0%, transparent 70%)",
                filter: "blur(32px)",
                transform: "scale(1.1) translateY(8%)",
              }}
            />

            {/* The floating card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.09), 0 40px 100px rgba(0,0,0,0.55), 0 0 80px rgba(192,168,79,0.06), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {/* Top shimmer line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(192,168,79,0.8) 40%, rgba(212,188,114,0.8) 60%, transparent 100%)",
                }}
              />

              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center px-8 py-14"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                      style={{
                        background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                        boxShadow: "0 8px 40px rgba(192,168,79,0.5)",
                      }}
                    >
                      <svg
                        className="w-9 h-9 text-[#0e2b49]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </motion.div>
                    <h3
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      You&apos;re Booked! 🎉
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      We&apos;ll call you shortly to confirm your free 30-min
                      session.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-7 py-8 sm:px-9 sm:py-10"
                  >
                    {/* Header */}
                    <div className="mb-7">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                        style={{
                          background: "rgba(192,168,79,0.1)",
                          border: "1px solid rgba(192,168,79,0.2)",
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
                            background:
                              "linear-gradient(135deg, #c0a84f, #d4bc72)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          Free Demo
                        </span>
                      </h2>
                      <p className="text-white/40 text-sm">
                        30 min · Live session · Expert trainer
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="group">
                        <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setErrors((p) => ({ ...p, name: undefined }));
                            }}
                            className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none transition-all duration-200"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border =
                                "1px solid rgba(192,168,79,0.5)";
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.1)";
                              e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(192,168,79,0.08)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border =
                                "1px solid rgba(255,255,255,0.1)";
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.07)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-400 text-xs mt-1.5">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-4 flex items-center gap-1.5 pointer-events-none">
                            <span className="text-white/40 text-sm">🇮🇳</span>
                            <span className="text-white/30 text-sm">+91</span>
                            <div className="w-px h-4 bg-white/15 ml-1" />
                          </div>
                          <input
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((p) => ({ ...p, phone: undefined }));
                            }}
                            maxLength={10}
                            className="w-full pl-[80px] pr-4 py-3.5 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none transition-all duration-200"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border =
                                "1px solid rgba(192,168,79,0.5)";
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.1)";
                              e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(192,168,79,0.08)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border =
                                "1px solid rgba(255,255,255,0.1)";
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.07)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-400 text-xs mt-1.5">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {formStatus === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs"
                        >
                          Something went wrong. Please try again.
                        </motion.p>
                      )}

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={formStatus === "loading"}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold text-[#0e2b49] text-sm flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60 cursor-pointer"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          background:
                            "linear-gradient(135deg, #c0a84f 0%, #d4bc72 50%, #c0a84f 100%)",
                          backgroundSize: "200% 100%",
                          boxShadow:
                            "0 8px 32px rgba(192,168,79,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
                        }}
                      >
                        {formStatus === "loading" ? (
                          <>
                            <svg
                              className="w-4 h-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Booking...
                          </>
                        ) : (
                          <>
                            Book Free Demo Now
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
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Trust row */}
                    <div className="flex items-center justify-center gap-4 mt-5">
                      {[
                        ["🔒", "Secure"],
                        ["⚡", "Instant"],
                        ["🎯", "Expert"],
                      ].map(([icon, label]) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <span className="text-xs">{icon}</span>
                          <span className="text-white/30 text-[11px]">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L1440 60L1440 20C1320 50 1200 60 1080 50C960 40 840 0 720 0C600 0 480 40 360 50C240 60 120 50 0 20L0 60Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}
