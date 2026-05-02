"use client";

import { useState, FormEvent } from "react";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const contactItems = [
    {
      label: "Email",
      value: "unikacademy2025@gmail.com",
      href: "mailto:unikacademy2025@gmail.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "9217196824",
      href: "tel:9217196824",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-4">
            Reach Out
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Get in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Touch
            </span>
          </h1>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto">
            Have questions about our courses? Want to enroll? We&apos;d love to
            hear from you.
          </p>
        </div>

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

      {/* ─── Contact content ─── */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — info */}
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                Contact Info
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0e2b49] mb-5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                We&apos;re Here to Help
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-6" />
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                Whether you have questions about our courses, pricing, or want
                to learn more — reach out and our team will get back to you
                promptly.
              </p>

              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_4px_20px_rgba(14,43,73,0.08)] transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center text-[#0e2b49] shadow-md group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-[#0e2b49] font-semibold text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-[#64748B] text-sm mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-br from-[#0e2b49] to-[#133a67] rounded-2xl p-6 text-white">
                <p
                  className="font-semibold mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Response Time
                </p>
                <p className="text-white/55 text-sm leading-relaxed">
                  We typically respond within 24 hours on business days. For
                  urgent queries, please call us directly.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
              <h3
                className="text-2xl font-bold text-[#0e2b49] mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Send a Message
              </h3>
              <p className="text-[#64748B] text-sm mb-7">
                Fill in the form and we&apos;ll get back to you as soon as
                possible.
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
                    Message Sent!
                  </h4>
                  <p className="text-[#64748B] text-sm">
                    Thanks for reaching out — we will connect with you as soon
                    as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm resize-none"
                      placeholder="How can we help you?"
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
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
