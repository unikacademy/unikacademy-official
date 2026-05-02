import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us – UNIK Academy | Communication Training India",
  description:
    "Learn about UNIK Academy's mission to empower individuals through expert communication, public speaking, and personality development training across India.",
  alternates: { canonical: "https://www.unikacademy.in/about" },
  openGraph: {
    title: "About Us – UNIK Academy | Communication Training India",
    description:
      "Learn about UNIK Academy's mission to empower individuals through expert communication, public speaking, and personality development training across India.",
    url: "https://www.unikacademy.in/about",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "About UNIK Academy",
      },
    ],
  },
  twitter: {
    title: "About Us – UNIK Academy | Communication Training India",
    description:
      "Learn about UNIK Academy's mission to empower individuals through expert communication, public speaking, and personality development training across India.",
  },
};

const reasons = [
  "Expert instructors with years of experience in communication training",
  "Personalized attention through flexible session formats (1-on-1, small groups)",
  "Comprehensive curriculum covering all aspects of communication and personality",
  "Practical, hands-on approach to learning",
  "Affordable pricing options to suit different needs",
];

const courses = [
  {
    title: "Communication Skills",
    desc: "Master the fundamentals of effective communication in personal and professional settings.",
  },
  {
    title: "Public Speaking & Presentation",
    desc: "Build confidence and excel in public speaking and professional presentations.",
  },
  {
    title: "Spoken English & Grammar",
    desc: "Improve your English fluency, grammar, and overall language proficiency.",
  },
  {
    title: "Personality Development",
    desc: "Transform your personality and develop essential leadership and interpersonal skills.",
  },
];

export default function About() {
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
            Our Story
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              UNIK Academy
            </span>
          </h1>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto">
            Empowering individuals through expert communication and personality
            development training — one voice at a time.
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

      {/* ─── Welcome ─── */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                Who We Are
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-5 leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Welcome to UNIK Academy
              </h2>
              <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-6" />
              <p className="text-[#64748B] text-lg leading-relaxed mb-4">
                UNIK Academy is a premier educational institution dedicated to
                empowering individuals through effective communication and
                personality development. We believe that strong communication
                skills are the foundation of personal and professional success.
              </p>
              <p className="text-[#64748B] text-lg leading-relaxed">
                Our mission is to transform personalities by providing
                comprehensive training in communication skills, public speaking,
                English language proficiency, and overall personality
                development.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#c0a84f]/15 rounded-full blur-2xl pointer-events-none" />
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Our Vision
              </h3>
              <div className="w-10 h-[2px] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-5" />
              <p className="text-white/65 leading-relaxed mb-8">
                To become the leading academy for communication skills and
                personality development, empowering individuals to achieve their
                full potential and excel in their personal and professional
                endeavors.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "500+", sub: "Students Trained" },
                  { n: "8", sub: "Core Courses" },
                  { n: "3", sub: "Session Formats" },
                  { n: "100%", sub: "Dedicated Support" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/8 rounded-xl p-3.5 border border-white/10"
                  >
                    <div
                      className="text-[#c0a84f] font-bold text-lg"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.n}
                    </div>
                    <div className="text-white/50 text-xs mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Why UNIK
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Why Choose UNIK Academy?
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_4px_20px_rgba(14,43,73,0.06)] transition-all duration-200"
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
                <p className="text-[#475569] text-sm leading-relaxed">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Courses ─── */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              What We Teach
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Core Courses
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)] transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#c0a84f]/15 to-[#d4bc72]/10 border border-[#c0a84f]/20 flex items-center justify-center">
                    <span
                      className="text-[#c0a84f] font-bold text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-[#0e2b49] font-semibold mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {course.title}
                    </h3>
                    <p className="text-[#64748B] text-sm leading-relaxed">
                      {course.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-4">
            Start Today
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Ready to Begin Your Journey?
          </h2>
          <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mb-6" />
          <p className="text-[#64748B] text-lg leading-relaxed mb-8">
            Contact us today and take the first step towards personal and
            professional excellence.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.35)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.5)] cursor-pointer text-base"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact Us
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
