"use client";

import { useState, useEffect, FormEvent } from "react";
import { usePathname } from "next/navigation";
import { validateName, validatePhone } from "@/lib/validation";

const STORAGE_KEY = "unik_demo_popup_dismissed";
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const SHOW_DELAY_MS = 2500;

export default function DemoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Quick Demo Request",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    // Never show on the demo page itself
    if (pathname === "/demo") return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);
    if (nameErr || phoneErr) {
      setFieldErrors({
        name: nameErr ?? undefined,
        phone: phoneErr ?? undefined,
      });
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-999 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-popup-title"
        className="fixed z-1000 inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-[#0e2b49] px-6 pt-6 pb-5">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0a84f]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <button
              onClick={dismiss}
              aria-label="Close popup"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white cursor-pointer"
            >
              <svg
                className="w-4 h-4"
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
            </button>

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-[10px] font-semibold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
                100% Free — No Commitment
              </div>
              <h2
                id="demo-popup-title"
                className="text-white text-xl font-bold leading-tight"
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
              </h2>
              <p className="text-white/55 text-sm mt-1">
                30-min live 1-on-1 session — pick your slot, we&apos;ll confirm
                within 24 hrs.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {submitStatus === "success" ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-7 h-7 text-[#0e2b49]"
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
                  className="text-lg font-bold text-[#0e2b49] mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Demo Booked!
                </h3>
                <p className="text-[#64748B] text-sm">
                  We&apos;ll reach out on WhatsApp / phone to confirm your slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="popup-name"
                    className="block text-xs font-semibold text-[#0e2b49] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="popup-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="popup-phone"
                    className="block text-xs font-semibold text-[#0e2b49] mb-1.5"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="popup-phone"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
                {submitStatus === "error" && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-[#0e2b49] bg-linear-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {isSubmitting ? "Booking..." : "Book My Free Demo Session"}
                </button>
                <p className="text-center text-[#94a3b8] text-[11px]">
                  No payment required &bull; We&apos;ll confirm within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
