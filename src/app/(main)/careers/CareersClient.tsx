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
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="font-semibold text-green-800 mb-1">
          Application submitted!
        </p>
        <p className="text-sm text-green-600">
          Thank you for applying. We will get back to you soon.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="mt-4 text-sm text-green-700 hover:underline font-medium"
        >
          Apply again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor={`name-${jobTitle}`}
          className="block text-sm font-semibold text-primary mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id={`name-${jobTitle}`}
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label
          htmlFor={`email-${jobTitle}`}
          className="block text-sm font-semibold text-primary mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id={`email-${jobTitle}`}
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label
          htmlFor={`phone-${jobTitle}`}
          className="block text-sm font-semibold text-primary mb-2"
        >
          Phone *
        </label>
        <input
          type="tel"
          id={`phone-${jobTitle}`}
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Your Phone Number"
        />
      </div>
      <div>
        <label
          htmlFor={`message-${jobTitle}`}
          className="block text-sm font-semibold text-primary mb-2"
        >
          Message (Optional)
        </label>
        <textarea
          id={`message-${jobTitle}`}
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
      {submitStatus === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          There was an error submitting your application. Please try again.
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-medium transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

function JobCard({ job }: { job: Job }) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Job header */}
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-primary-medium mb-1">
            {job.title.toUpperCase()}
          </h3>
          <p className="text-xl text-gray-600 mb-2">{job.type}</p>
          <p className="text-lg text-accent font-semibold">
            {job.workMode.toUpperCase()}
          </p>
        </div>

        {job.responsibilities.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary mb-4">
              RESPONSIBILITIES
            </h4>
            <ul className="space-y-3 text-gray-700">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-accent mr-3 text-xl flex-shrink-0">
                    •
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.eligibility.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary mb-4">ELIGIBILITY</h4>
            <ul className="space-y-3 text-gray-700">
              {job.eligibility.map((e, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-accent mr-3 text-xl flex-shrink-0">
                    •
                  </span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-accent/10 p-6 rounded-lg text-center mb-6">
          <p className="text-lg font-semibold text-primary mb-2">TO APPLY</p>
          <a
            href="mailto:unikacademy2025@gmail.com"
            className="text-accent font-bold text-xl hover:underline"
          >
            unikacademy2025@gmail.com
          </a>
        </div>

        <button
          onClick={() => setApplyOpen((o) => !o)}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-medium transition-colors font-semibold flex items-center justify-center gap-2"
        >
          {applyOpen ? "Close Application Form" : "Apply Now"}
          <svg
            className={`w-4 h-4 transition-transform ${applyOpen ? "rotate-180" : ""}`}
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

      {/* Collapsible apply form */}
      {applyOpen && (
        <div className="border-t border-gray-100 px-8 pb-8 pt-6">
          <h4 className="text-xl font-bold text-primary mb-6 text-center">
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
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            WE&apos;RE HIRING!
          </h1>
          <h2 className="text-3xl font-bold text-accent mb-4">UNIK</h2>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-xl font-bold text-primary mb-2">
              No Open Positions Right Now
            </h3>
            <p className="text-gray-500">
              We don&apos;t have any openings at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
