"use client";

import { useState, FormEvent } from "react";

interface Job {
  _id: string;
  title: string;
  type: string;
  workMode: string;
  responsibilities: string[];
  eligibility: string[];
}

interface ApplyFormProps {
  jobTitle: string;
}

function ApplyForm({ jobTitle }: ApplyFormProps) {
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
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, position: jobTitle }),
      });
      if (res.ok) {
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
  ) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (submitStatus === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mx-auto mb-4 shadow-lg">
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
        <p
          className="font-bold text-[#0e2b49] mb-1"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Application Submitted!
        </p>
        <p className="text-[#64748B] text-sm mb-4">
          Thank you for applying. We will get back to you soon.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="text-sm text-[#c0a84f] hover:text-[#0e2b49] font-semibold transition-colors"
        >
          Apply again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        {
          id: "name",
          label: "Full Name *",
          type: "text",
          name: "name",
          required: true,
          placeholder: "Your full name",
          value: formData.name,
        },
        {
          id: "email",
          label: "Email *",
          type: "email",
          name: "email",
          required: true,
          placeholder: "your@email.com",
          value: formData.email,
        },
        {
          id: "phone",
          label: "Phone *",
          type: "tel",
          name: "phone",
          required: true,
          placeholder: "Your phone number",
          value: formData.phone,
        },
      ].map((field) => (
        <div key={field.id}>
          <label
            htmlFor={`${field.id}-${jobTitle}`}
            className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
          >
            {field.label}
          </label>
          <input
            type={field.type}
            id={`${field.id}-${jobTitle}`}
            name={field.name}
            required={field.required}
            value={field.value}
            onChange={handleChange}
            placeholder={field.placeholder}
            autoComplete={
              field.id === "phone"
                ? "tel"
                : field.id === "email"
                  ? "email"
                  : "name"
            }
            {...(field.id === "phone" ? { inputMode: "numeric" as const } : {})}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm"
          />
        </div>
      ))}
      <div>
        <label
          htmlFor={`message-${jobTitle}`}
          className="block text-sm font-semibold text-[#0e2b49] mb-1.5"
        >
          Message (Optional)
        </label>
        <textarea
          id={`message-${jobTitle}`}
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#0e2b49] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c0a84f]/50 focus:border-[#c0a84f] transition-colors text-sm resize-none"
        />
      </div>

      {submitStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function JobCard({ job }: { job: Job }) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#c0a84f]/30 hover:shadow-[0_8px_40px_rgba(14,43,73,0.08)] transition-all duration-300">
      <div className="p-8">
        {/* Job header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-2xl font-bold text-[#0e2b49] mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {job.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0e2b49]/8 text-[#0e2b49]">
                {job.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#c0a84f]/12 text-[#c0a84f] border border-[#c0a84f]/20">
                {job.workMode}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {job.responsibilities.length > 0 && (
            <div>
              <h4
                className="text-sm font-bold text-[#0e2b49] uppercase tracking-widest mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Responsibilities
              </h4>
              <ul className="space-y-3">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#c0a84f]/20 to-[#d4bc72]/15 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#c0a84f]"
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
                    <span className="text-[#64748B] text-sm leading-relaxed">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.eligibility.length > 0 && (
            <div>
              <h4
                className="text-sm font-bold text-[#0e2b49] uppercase tracking-widest mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Eligibility
              </h4>
              <ul className="space-y-3">
                {job.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#0e2b49]/10 to-[#133a67]/8 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#0e2b49]"
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
                    <span className="text-[#64748B] text-sm leading-relaxed">
                      {el}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Email to apply */}
        <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 mb-5">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#0e2b49]"
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
          </div>
          <div>
            <p
              className="text-xs font-semibold text-[#0e2b49] uppercase tracking-widest"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Or email us directly
            </p>
            <a
              href="mailto:official@unikacademy.in"
              className="text-[#c0a84f] font-semibold text-sm hover:text-[#0e2b49] transition-colors"
            >
              official@unikacademy.in
            </a>
          </div>
        </div>

        <button
          onClick={() => setApplyOpen((o) => !o)}
          className="w-full py-3.5 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] cursor-pointer flex items-center justify-center gap-2 text-sm"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {applyOpen ? "Close Application Form" : "Apply Now"}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${applyOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {applyOpen && (
        <div className="border-t border-[#E2E8F0] px-8 pb-8 pt-6 bg-[#F8FAFC]">
          <h4
            className="text-lg font-bold text-[#0e2b49] mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Apply for {job.title}
          </h4>
          <ApplyForm jobTitle={job.title} />
        </div>
      )}
    </div>
  );
}

export function CareersClient({ jobs }: { jobs: Job[] }) {
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
            Join Our Team
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            We&apos;re{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Hiring
            </span>
          </h1>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto">
            Join our team of passionate educators and help students master
            communication and personality development.
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

      {/* ─── Job listings ─── */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Open Positions</h2>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-14 text-center">
              <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-[#94a3b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                No Open Positions Right Now
              </h2>
              <p className="text-[#64748B] text-sm">
                We don&apos;t have any openings at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
