"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

const ALL_COURSES = [
  {
    title: "Communication Skills",
    duration: "12 Weeks",
    level: "Beginner–Advanced",
  },
  {
    title: "Business Communication",
    duration: "12 Weeks",
    level: "Professional",
  },
  {
    title: "Personality Development",
    duration: "12 Weeks",
    level: "All Levels",
  },
  { title: "Public Speaking", duration: "12 Weeks", level: "All Levels" },
  {
    title: "Spoken English & Grammar",
    duration: "12 Weeks",
    level: "Beginner",
  },
  {
    title: "Communication Skills – Intermediate",
    duration: "4 Weeks",
    level: "Intermediate",
  },
  {
    title: "Communication Skills – Advanced",
    duration: "4 Weeks",
    level: "Advanced",
  },
  { title: "Basic Communication", duration: "4 Weeks", level: "Beginner" },
];

const SESSION_FORMATS = [
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
];

const WHAT_INCLUDED = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    title: "Live Interactive Sessions",
    desc: "Real-time sessions with expert trainers, not pre-recorded videos.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    title: "UNIK Academy Certificate",
    desc: "Gold, Silver, or Bronze certification based on your performance.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    ),
    title: "Real-World Practice",
    desc: "Multiple practice rounds each week to build lasting confidence.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
    title: "Doubt Resolution In Session",
    desc: "Every question answered in real-time during live sessions.",
  },
];

const FAQS = [
  {
    q: "How do I start? Do I need to pay upfront?",
    a: "Start with a completely free demo session — no payment required. After the demo, you can choose your course and session format and enroll.",
  },
  {
    q: "Can I switch my session format after enrolling?",
    a: "Yes, you can upgrade or change your session format before the course begins. Contact us and we'll help you switch.",
  },
  {
    q: "What if I miss a session?",
    a: "We understand life happens. You can reschedule missed sessions with prior notice. Our team will work with your schedule.",
  },
  {
    q: "Is there a refund policy?",
    a: "If you're not satisfied after your first 3 sessions, we'll discuss a solution. Our goal is your growth, and we'll make it work.",
  },
  {
    q: "Are sessions conducted in Hindi or English?",
    a: "Sessions are conducted in English, with bilingual explanation in Hindi when needed to ensure complete understanding.",
  },
];

interface Props {
  preSelectedCourse?: string;
}

export default function EnrollClient({ preSelectedCourse }: Props) {
  const [selectedFormat, setSelectedFormat] = useState(SESSION_FORMATS[0].id);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: preSelectedCourse ?? "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const format = SESSION_FORMATS.find((f) => f.id === selectedFormat);
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          course: `${formData.course} (${format?.label ?? selectedFormat})`,
          message:
            formData.message ||
            `Enrollment request for ${format?.label} at ${format?.price}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[#0e2b49] text-white py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#133a67]/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-4">
            Choose Your Plan
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Enroll &amp;{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transform
            </span>
          </h1>
          <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            Pick the session format that works best for you. Start with a{" "}
            <span className="text-[#c0a84f] font-semibold">free demo</span> — no
            commitment required.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-sm hover:bg-white/15 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-[#c0a84f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
            Try a Free Demo First — No Payment
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-12"
          >
            <path
              d="M0 50L1440 50L1440 15C1320 40 1200 50 1080 40C960 30 840 0 720 0C600 0 480 30 360 40C240 50 120 40 0 15L0 50Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* ─── Session Format Cards ─── */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Pricing Plans
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Choose Your Session Format
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SESSION_FORMATS.map((sf) => (
              <div
                key={sf.id}
                className={`relative rounded-2xl border p-6 transition-all duration-200 cursor-pointer ${
                  sf.highlight
                    ? "bg-gradient-to-br from-[#0e2b49] to-[#133a67] border-[#0e2b49] shadow-[0_8px_40px_rgba(14,43,73,0.2)] scale-[1.02]"
                    : "bg-white border-[#E2E8F0] hover:border-[#c0a84f]/30 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)]"
                }`}
                onClick={() => setSelectedFormat(sf.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedFormat(sf.id)}
                aria-pressed={selectedFormat === sf.id}
              >
                {sf.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] text-[11px] font-bold uppercase tracking-widest shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sf.badgeColor}`}
                  >
                    {sf.badge}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold mb-1 ${sf.highlight ? "text-white" : "text-[#0e2b49]"}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {sf.label}
                </h3>
                <div
                  className={`text-3xl font-bold mb-5 ${sf.highlight ? "text-[#c0a84f]" : "text-[#0e2b49]"}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {sf.price}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {sf.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <svg
                        className={`w-4 h-4 shrink-0 ${sf.highlight ? "text-[#c0a84f]" : "text-[#c0a84f]"}`}
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
                      <span
                        className={`text-sm ${sf.highlight ? "text-white/80" : "text-[#64748B]"}`}
                      >
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`w-full py-3 rounded-xl text-sm font-bold text-center cursor-pointer transition-all duration-200 ${
                    selectedFormat === sf.id
                      ? "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-md"
                      : sf.highlight
                        ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
                        : "bg-[#F8FAFC] text-[#0e2b49] border border-[#E2E8F0] hover:border-[#c0a84f]/30"
                  }`}
                >
                  {selectedFormat === sf.id ? "Selected" : "Select This Plan"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Course + Enrollment Form ─── */}
      <section className="pb-16 md:pb-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — course picker + what's included */}
            <div className="space-y-8">
              {/* Course grid */}
              <div>
                <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                  Step 1
                </p>
                <h2
                  className="text-2xl font-bold text-[#0e2b49] mb-5"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Choose Your Course
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_COURSES.map((c) => (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() =>
                        setFormData((f) => ({ ...f, course: c.title }))
                      }
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer w-full ${
                        formData.course === c.title
                          ? "bg-[#0e2b49] border-[#0e2b49] text-white shadow-md"
                          : "bg-white border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_4px_16px_rgba(14,43,73,0.06)]"
                      }`}
                    >
                      <p
                        className={`font-semibold text-sm leading-snug mb-1 ${formData.course === c.title ? "text-white" : "text-[#0e2b49]"}`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {c.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${formData.course === c.title ? "text-[#c0a84f]" : "text-[#94A3B8]"}`}
                        >
                          {c.duration}
                        </span>
                        <span
                          className={`text-xs ${formData.course === c.title ? "text-white/50" : "text-[#CBD5E1]"}`}
                        >
                          ·
                        </span>
                        <span
                          className={`text-xs ${formData.course === c.title ? "text-white/70" : "text-[#94A3B8]"}`}
                        >
                          {c.level}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] rounded-2xl p-6">
                <p className="text-[#c0a84f] text-xs font-bold uppercase tracking-widest mb-5">
                  Every Plan Includes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WHAT_INCLUDED.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#c0a84f]">
                        {item.icon}
                      </div>
                      <div>
                        <p
                          className="text-white font-semibold text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.title}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — enrollment form */}
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                Step 2
              </p>
              <h2
                className="text-2xl font-bold text-[#0e2b49] mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Complete Your Enrollment
              </h2>
              <p className="text-[#64748B] text-sm mb-6">
                Fill in your details and our team will contact you within 24
                hours to confirm your enrollment.
              </p>

              {status === "success" ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mx-auto mb-4 shadow-lg">
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
                    Enrollment Request Sent!
                  </h3>
                  <p className="text-[#64748B] text-sm mb-6">
                    We&apos;ll reach out within 24 hours to confirm your{" "}
                    <span className="text-[#c0a84f] font-semibold">
                      {formData.course}
                    </span>{" "}
                    enrollment.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm text-[#c0a84f] hover:text-[#0e2b49] font-semibold transition-colors cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-5"
                >
                  {/* Selected summary */}
                  {(formData.course || selectedFormat) && (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#0e2b49]">
                        {formData.course || "No course selected"}
                      </span>
                      {selectedFormat && (
                        <>
                          <span className="text-[#CBD5E1]">·</span>
                          <span className="font-semibold text-[#c0a84f]">
                            {
                              SESSION_FORMATS.find(
                                (f) => f.id === selectedFormat,
                              )?.label
                            }
                          </span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span className="font-bold text-[#0e2b49]">
                            {
                              SESSION_FORMATS.find(
                                (f) => f.id === selectedFormat,
                              )?.price
                            }
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="enroll-name"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="enroll-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-phone"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="enroll-phone"
                      type="tel"
                      name="phone"
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-email"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="enroll-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-course"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Course of Interest *
                    </label>
                    <select
                      id="enroll-course"
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a course
                      </option>
                      {ALL_COURSES.map((c) => (
                        <option key={c.title} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Session format inline selector */}
                  <div>
                    <p className="block text-sm font-semibold text-[#0e2b49] mb-2">
                      Session Format *
                    </p>
                    <div className="space-y-2">
                      {SESSION_FORMATS.map((sf) => (
                        <label
                          key={sf.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                            selectedFormat === sf.id
                              ? "border-[#c0a84f] bg-[#c0a84f]/6"
                              : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#c0a84f]/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="sessionFormat"
                              value={sf.id}
                              checked={selectedFormat === sf.id}
                              onChange={() => setSelectedFormat(sf.id)}
                              className="accent-[#c0a84f] w-4 h-4"
                            />
                            <span className="text-sm font-semibold text-[#0e2b49]">
                              {sf.label}
                            </span>
                            <span className="text-[10px] font-bold text-[#c0a84f] bg-[#c0a84f]/10 px-1.5 py-0.5 rounded-full">
                              {sf.badge}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-[#0e2b49] tabular-nums">
                            {sf.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-message"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Message (Optional)
                    </label>
                    <textarea
                      id="enroll-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any questions or specific requirements?"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                      role="alert"
                    >
                      Something went wrong. Please try again or call us
                      directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {status === "submitting"
                      ? "Submitting..."
                      : "Submit Enrollment Request"}
                  </button>

                  <p className="text-[#94A3B8] text-xs text-center">
                    We&apos;ll contact you within 24 hours to confirm your seat.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Questions
            </p>
            <h2
              className="text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden"
              >
                <summary
                  className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-[#0e2b49] text-sm hover:bg-[#c0a84f]/5 transition-colors duration-150"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {faq.q}
                  <svg
                    className="w-4 h-4 text-[#c0a84f] shrink-0 ml-3 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-[#64748B] text-sm leading-relaxed border-t border-[#E2E8F0] pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-16 md:py-20 bg-[#0e2b49] text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-[#c0a84f] text-xs font-bold uppercase tracking-widest mb-4">
            Still Unsure?
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Try a Free Demo First
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed">
            Experience our teaching style before you commit. A free 30-minute
            live session — no payment, no pressure.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-lg hover:shadow-[0_8px_32px_rgba(192,168,79,0.4)] cursor-pointer text-sm"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Book Your Free Demo
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
        </div>
      </section>
    </div>
  );
}
