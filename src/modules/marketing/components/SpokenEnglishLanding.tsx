"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

function track(event: string, params?: Record<string, string>) {
  try {
    if (typeof window !== "undefined") {
      const g = (window as unknown as Record<string, (...a: unknown[]) => void>)
        .gtag;
      if (typeof g === "function") g(event, params);
      const fbq = (
        window as unknown as Record<string, (...a: unknown[]) => void>
      ).fbq;
      if (typeof fbq === "function") fbq("track", event, params);
    }
  } catch {}
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#c0a84f] shrink-0 mt-0.5"
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
  );
}

const faqs = [
  {
    q: "Is this course for beginners?",
    a: "Absolutely! Our Spoken English course is designed for all levels — whether you're a complete beginner or someone who wants to polish their fluency, we tailor the learning to your current level.",
  },
  {
    q: "Are classes live?",
    a: "Yes, all classes are 100% live and interactive. You get real-time feedback from expert trainers and practice with peers in every session.",
  },
  {
    q: "Will I get speaking practice?",
    a: "Speaking practice is at the heart of every class. You'll participate in daily speaking exercises, role plays, group discussions, and mock interviews throughout the course.",
  },
  {
    q: "What is the duration of the course?",
    a: "The core Spoken English program runs for 30 days with daily live sessions. Extended batches are also available for deeper practice and advanced topics.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, Pune",
    feedback:
      "I used to freeze during interviews. After just 3 weeks at UNIK Academy, I cracked my dream company offer. The mock interviews and personalized feedback made all the difference.",
    initials: "PS",
    color: "from-[#c0a84f] to-[#d4bc72]",
  },
  {
    name: "Rohit Mehta",
    role: "MBA Student, Delhi",
    feedback:
      "My biggest fear was public speaking. UNIK's daily speaking practice helped me present confidently in front of 200+ people at college. Worth every rupee!",
    initials: "RM",
    color: "from-[#133a67] to-[#0e2b49]",
  },
  {
    name: "Anjali Verma",
    role: "HR Executive, Bangalore",
    feedback:
      "The trainers are incredibly patient and supportive. In 30 days my fluency improved dramatically and I got promoted within two months of completing the course.",
    initials: "AV",
    color: "from-[#c0a84f] to-[#133a67]",
  },
];

export default function SpokenEnglishLanding() {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course: "Spoken English & Grammar",
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        track("form_submission", { form: "spoken_english_lead_capture" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* ── Minimal Header ─────────────────────────────────── */}
      <header className="bg-[#0e2b49] py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center shadow">
              <span
                className="text-[#0e2b49] font-bold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                U
              </span>
            </div>
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              UNIK <span className="text-[#c0a84f]">Academy</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Phase 10: Urgency Banner ────────────────────────── */}
      <div className="bg-linear-to-r from-[#c0a84f] to-[#d4bc72] py-2 px-4 text-center">
        <p
          className="text-[#0e2b49] text-sm font-semibold"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          🔥 Next Batch Starting Soon — Limited Seats Available! Enroll now to
          secure your spot.
        </p>
      </div>

      {/* ── Phase 2: Hero Section ───────────────────────────── */}
      <section className="bg-[#0e2b49] relative overflow-hidden py-16 sm:py-24 px-4">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#133a67] rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
            Spoken English Course
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Speak English{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Confidently
            </span>{" "}
            in 30 Days
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-8 font-medium">
            Live Classes &nbsp;·&nbsp; Interview Preparation &nbsp;·&nbsp;
            Personality Development
          </p>

          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 text-white/80 text-sm sm:text-base">
            {[
              "Improve fluency & confidence",
              "Crack interviews easily",
              "Learn with expert trainers",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c0a84f]/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3 h-3 text-[#c0a84f]"
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
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#lead-form"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[#0e2b49] bg-linear-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-lg hover:shadow-[0_8px_30px_rgba(192,168,79,0.4)] text-base cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Book Free Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── Phase 3: Trust Section ──────────────────────────── */}
      <section className="bg-white border-b border-[#E2E8F0] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "500+", label: "Students Trained" },
            { value: "4.8 ★", label: "Rating" },
            { value: "100%", label: "Practical Learning" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                className="text-3xl sm:text-4xl font-bold text-[#0e2b49]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {value}
              </p>
              <p className="text-sm sm:text-base text-[#64748b] mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phase 4: Problem & Solution ─────────────────────── */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Do You Struggle With…
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problems */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold text-[#0e2b49]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  The Problem
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Hesitation while speaking English",
                  "Low confidence in interviews",
                  "Fear of public speaking",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[#64748b]"
                  >
                    <svg
                      className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-[#0e2b49] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#c0a84f]/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#c0a84f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  The UNIK Solution
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Real-life conversation practice",
                  "Confidence-building exercises",
                  "Personalized feedback from experts",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-white/80"
                  >
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Phase 5: Benefits ───────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              What You Will Achieve
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Speak fluently without hesitation",
              "Crack interviews with confidence",
              "Improve personality and body language",
              "Build powerful communication skills",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]"
              >
                <CheckIcon />
                <span className="text-[#0e2b49] font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Phase 6: Course Features ────────────────────────── */}
      <section className="py-16 px-4 bg-[#0e2b49]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-15 h-1 bg-linear-to-r from-[#c0a84f] to-[#d4bc72] rounded mx-auto mb-4" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              What&apos;s Inside the Course
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🎯",
                title: "Live Interactive Classes",
                desc: "Real-time sessions with expert trainers",
              },
              {
                icon: "🗣️",
                title: "Daily Speaking Practice",
                desc: "Speak every single day to build fluency fast",
              },
              {
                icon: "💼",
                title: "Mock Interviews",
                desc: "Simulate real interview scenarios with feedback",
              },
              {
                icon: "⭐",
                title: "Expert Guidance",
                desc: "Personalized coaching and progress tracking",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3
                  className="text-white font-bold mb-1.5 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Phase 7: Testimonials ───────────────────────────── */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Students Who Transformed Their Lives
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, feedback, initials, color }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full bg-linear-to-br ${color} flex items-center justify-center shrink-0 shadow`}
                  >
                    <span className="text-white font-bold text-sm">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-bold text-[#0e2b49] text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {name}
                    </p>
                    <p className="text-[#64748b] text-xs">{role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-[#c0a84f] fill-[#c0a84f]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#64748b] text-sm leading-relaxed flex-1">
                  &ldquo;{feedback}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Phase 8: Lead Capture Form ──────────────────────── */}
      <section id="lead-form" className="py-16 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="section-divider" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Book Your Free Demo Now
            </h2>
            <p className="text-[#64748b] mt-2">
              No payment required. We&apos;ll confirm within 24 hours.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm">
            {submitStatus === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-[#0e2b49]"
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
                </div>
                <h3
                  className="text-xl font-bold text-[#0e2b49] mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Demo Booked!
                </h3>
                <p className="text-[#64748b]">
                  We&apos;ll reach out on WhatsApp or phone to confirm your
                  slot. See you in class!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="lp-name"
                    className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="lp-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lp-phone"
                    className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="lp-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors"
                  />
                </div>

                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    Something went wrong. Please try again or WhatsApp us.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-[#0e2b49] bg-linear-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {submitting ? "Booking…" : "Book Free Demo Now"}
                </button>
                <p className="text-center text-[#94a3b8] text-xs">
                  100% Free &bull; No commitment &bull; Confirm within 24 hrs
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Phase 11: FAQ ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span
                    className="font-semibold text-[#0e2b49] text-sm sm:text-base"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#c0a84f] shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-[#64748b] text-sm leading-relaxed border-t border-[#E2E8F0] pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Phase 12: Final CTA ─────────────────────────────── */}
      <section className="py-16 px-4 bg-[#0e2b49]">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Start Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transformation
            </span>{" "}
            Today
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Join 500+ students who have already transformed their careers and
            confidence with UNIK Academy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#lead-form"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[#0e2b49] bg-linear-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-lg hover:shadow-[0_8px_30px_rgba(192,168,79,0.4)] text-base cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Book Free Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ──────────────────────────────────── */}
      <footer className="bg-[#0a2240] py-6 px-4 text-center">
        <p className="text-white/40 text-sm">
          &copy; {new Date().getFullYear()} UNIK Academy. All rights reserved.
          &nbsp;·&nbsp;{" "}
          <Link
            href="/privacy-policy"
            className="hover:text-[#c0a84f] transition-colors"
          >
            Privacy Policy
          </Link>
          &nbsp;·&nbsp;
          <Link
            href="/terms"
            className="hover:text-[#c0a84f] transition-colors"
          >
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
