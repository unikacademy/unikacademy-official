"use client";

import { useState, FormEvent } from "react";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = [
    {
      num: "1",
      title: "Meet Your Instructor",
      desc: "Get introduced to your personal trainer and understand the teaching style.",
    },
    {
      num: "2",
      title: "Share Your Goals",
      desc: "Tell us where you are now and where you want to be.",
    },
    {
      num: "3",
      title: "Get Your Roadmap",
      desc: "Receive a customized learning plan tailored to your needs.",
    },
    {
      num: "4",
      title: "Ask Anything",
      desc: "Clear all your doubts about courses, schedules, and pricing.",
    },
  ];

  const courses = [
    "Communication Skills",
    "Business Communication",
    "Public Speaking & Presentation",
    "Spoken English & Grammar",
    "Personality Development",
    "Basic Communication",
    "Intermediate Communication",
    "Advanced Communication",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[#0e2b49] text-white py-20">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#133a67]/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c0a84f] animate-pulse" />
            100% Free — No Commitment
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
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
            </span>{" "}
            Session
          </h1>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto">
            Experience our teaching style first-hand with a free 30-minute live
            session — no payment, no pressure, just learning.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { value: "30 min", label: "Live session" },
              { value: "1-on-1", label: "Personal attention" },
              { value: "FREE", label: "No hidden charges" },
              { value: "Flexible", label: "Pick your slot" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/8 border border-white/12 rounded-xl px-5 py-3 text-center min-w-[110px]"
              >
                <div
                  className="text-[#c0a84f] font-bold text-lg"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50L1440 50L1440 15C1320 40 1200 50 1080 40C960 30 840 0 720 0C600 0 480 30 360 40C240 50 120 40 0 15L0 50Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* ─── What Happens in the Demo ─── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              What to Expect
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Your 30-Minute Demo Journey
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mb-4 shadow-md">
                  <span
                    className="text-[#0e2b49] font-bold text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="text-[#0e2b49] font-semibold mb-2 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Form + Info ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left info */}
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                Why Book a Demo
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0e2b49] mb-5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Try Before You Enroll
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-6" />
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                We believe you should feel confident before committing. Our free
                demo lets you experience the quality of our teaching, ask all
                your questions, and decide if UNIK Academy is the right fit for
                you.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "No payment required",
                    desc: "The demo session is completely free — forever.",
                  },
                  {
                    title: "Live, not recorded",
                    desc: "Every demo is a real-time interactive session with an instructor.",
                  },
                  {
                    title: "Tailored to you",
                    desc: "We design the demo around your specific goals and course interest.",
                  },
                  {
                    title: "Weekend slots available",
                    desc: "Choose a time that works for your schedule.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4 text-[#0e2b49]"
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
                    <div>
                      <p
                        className="text-[#0e2b49] font-semibold text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-[#64748B] text-sm mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price callout */}
              <div className="mt-8 flex items-center gap-4 bg-gradient-to-r from-[#0e2b49] to-[#133a67] rounded-2xl p-5">
                <div className="flex-shrink-0">
                  <div className="text-white/40 text-sm line-through">₹499</div>
                  <div
                    className="text-[#c0a84f] font-bold text-3xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    FREE
                  </div>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <p className="text-white font-semibold text-sm">
                    Demo Session
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    30 min &bull; Live &bull; 1-on-1 &bull; No commitment
                  </p>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8">
              <h3
                className="text-2xl font-bold text-[#0e2b49] mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Book Your Slot
              </h3>
              <p className="text-[#64748B] text-sm mb-7">
                Fill in your details and we&apos;ll reach out to confirm your
                demo session.
              </p>

              {submitStatus === "success" ? (
                <div className="text-center py-10">
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
                  <h4
                    className="text-xl font-bold text-[#0e2b49] mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Demo Booked!
                  </h4>
                  <p className="text-[#64748B] text-sm">
                    Thanks for submitting your details — we will connect with
                    you as soon as possible!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Course of Interest *
                    </label>
                    <select
                      id="course"
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm cursor-pointer"
                    >
                      <option value="">Select a course</option>
                      {courses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Anything you&apos;d like us to know?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm resize-none"
                      placeholder="Your goals, preferred time slot, etc."
                    />
                  </div>

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      Something went wrong. Please try again or call us
                      directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {isSubmitting ? "Booking..." : "Book My Free Demo Session"}
                  </button>
                  <p className="text-center text-[#94a3b8] text-xs">
                    No payment required &bull; We&apos;ll confirm your slot
                    within 24 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ─── FAQ ─── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Got Questions?
            </p>
            <h2
              className="text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Who is the demo session for?",
                a: "Anyone who wants to improve their communication, spoken English, public speaking, or personality. Whether you are a student, working professional, or homemaker — our demo is open to all.",
              },
              {
                q: "Do I need to pay anything for the demo?",
                a: "Absolutely not. The demo session is 100% free with no hidden charges and zero commitment to enroll afterwards.",
              },
              {
                q: "How will UNIK Academy contact me after I submit the form?",
                a: "We will reach out via phone or WhatsApp within 24 hours to confirm your slot and share the session link.",
              },
              {
                q: "Is the session online or in-person?",
                a: "The demo is conducted online via video call, so you can join from anywhere in India — no travel needed.",
              },
              {
                q: "What happens after the demo?",
                a: "After your demo session, you will receive a personalised course recommendation and pricing details. There is no pressure to enroll — you decide at your own pace.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
              >
                <p
                  className="text-[#0e2b49] font-semibold mb-2 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {faq.q}
                </p>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
