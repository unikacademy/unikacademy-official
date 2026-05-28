import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { courseDetailsData } from "@/website/data/courseDetails";
import { SESSION_FORMATS, STARTING_FROM_PRICE, FOUR_WEEK_SESSION_FORMATS, FOUR_WEEK_STARTING_FROM, computeMRP } from "@/lib/constants";
import CourseCurriculum from "@/website/components/CourseCurriculum";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return courseDetailsData.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = courseDetailsData.find((c) => c.id === slug);
  if (!course) return { title: "Course Not Found | UNIK Academy" };
  const desc =
    course.overview.length > 155
      ? course.overview.slice(0, 152) + "..."
      : course.overview;
  return {
    title: `${course.title} – UNIK Academy | Live Communication Training`,
    description: desc,
    alternates: { canonical: `https://www.unikacademy.in/courses/${slug}` },
    openGraph: {
      title: `${course.title} – UNIK Academy`,
      description: course.overview,
      url: `https://www.unikacademy.in/courses/${slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${course.title} – UNIK Academy`,
        },
      ],
    },
    twitter: {
      title: `${course.title} – UNIK Academy`,
      description: desc,
    },
  };
}

const INSTRUCTOR = {
  initials: "UA",
  name: "Certified Communication Expert",
  title: "Lead Trainer · UNIK Academy",
  experience: "8+ Years",
  students: "500+",
  rating: "4.9★",
  bio: "Our expert trainers are certified communication coaches with 8+ years of experience transforming hesitant speakers into confident, impactful communicators. Every session blends proven techniques with intensive real-world practice to ensure lasting results.",
};


const CERT_TIERS = [
  {
    tier: "Gold",
    range: "Above 80%",
    color: "#c0a84f",
    bg: "bg-[#c0a84f]/8 border-[#c0a84f]/25",
  },
  {
    tier: "Silver",
    range: "70% – 80%",
    color: "#94A3B8",
    bg: "bg-slate-50 border-slate-200",
  },
  {
    tier: "Bronze",
    range: "60% – 70%",
    color: "#b45309",
    bg: "bg-amber-50 border-amber-200",
  },
];

const INCLUDED = [
  "Live Interactive Sessions",
  "Expert Communication Trainer",
  "UNIK Academy Certificate",
  "Real-World Practice Exercises",
  "Doubt Resolution In Session",
  "Flexible Scheduling Options",
];

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = courseDetailsData.find((c) => c.id === slug);
  if (!course) notFound();

  const is4Week = course.duration === "4 Weeks";
  const activeFormats = is4Week ? FOUR_WEEK_SESSION_FORMATS : SESSION_FORMATS;
  const startingFrom = is4Week ? FOUR_WEEK_STARTING_FROM : STARTING_FROM_PRICE;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero ─── */}
      <div className="relative bg-[#0e2b49] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-[#c0a84f]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#c0a84f]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-white/55 mb-8"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-white/80 transition-colors duration-150 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Home
            </Link>
            <span className="text-white/30">›</span>
            <Link
              href="/#courses"
              className="hover:text-white/80 transition-colors duration-150"
            >
              Courses
            </Link>
            <span className="text-white/30">›</span>
            <span className="text-white/80 font-medium truncate max-w-[200px]">
              {course.title}
            </span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-[11px] font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
              Live Program
            </span>
            <span className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/50 text-[11px]">
              {course.programType}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight max-w-3xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {course.title}
          </h1>
          <p className="text-[#c0a84f] text-base italic font-medium mb-8 max-w-2xl">
            {course.subtitle}
          </p>

          {/* Instructor quick info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center shrink-0 shadow-md">
              <span className="text-[#0e2b49] font-bold text-xs">
                {INSTRUCTOR.initials}
              </span>
            </div>
            <p className="text-white/65 text-sm">
              Taught by{" "}
              <span className="text-white font-semibold">
                {INSTRUCTOR.name}
              </span>
              <span className="text-white/40 text-xs ml-2">
                {INSTRUCTOR.rating} · {INSTRUCTOR.students} students
              </span>
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Duration", value: course.duration },
              { label: "Live Sessions", value: String(course.totalSessions) },
              { label: "Total Hours", value: `${course.totalHours}h` },
              { label: "Mode", value: "Live Online" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-center sm:text-left"
              >
                <div
                  className="text-[#c0a84f] font-bold text-xl leading-none mb-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/40 text-[11px] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-10"
          >
            <path
              d="M0 40L1440 40L1440 12C1320 32 1200 40 1080 32C960 24 840 0 720 0C600 0 480 24 360 32C240 40 120 32 0 12L0 40Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ─── Main content ─── */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* What you'll learn */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#c0a84f]/20 to-[#d4bc72]/15 border border-[#c0a84f]/30 flex items-center justify-center mt-0.5">
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
                    </div>
                    <span className="text-[#475569] text-sm leading-relaxed">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Your Instructor
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0e2b49] to-[#133a67] flex items-center justify-center shadow-lg">
                  <span
                    className="text-[#c0a84f] font-bold text-2xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {INSTRUCTOR.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg font-bold text-[#0e2b49] mb-0.5"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {INSTRUCTOR.name}
                  </h3>
                  <p className="text-[#c0a84f] text-sm font-medium mb-4">
                    {INSTRUCTOR.title}
                  </p>
                  <div className="flex flex-wrap gap-6 mb-4">
                    {[
                      { value: INSTRUCTOR.experience, label: "Experience" },
                      { value: INSTRUCTOR.students, label: "Students Trained" },
                      { value: INSTRUCTOR.rating, label: "Course Rating" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div
                          className="text-[#0e2b49] font-bold text-base"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {s.value}
                        </div>
                        <div className="text-[#94A3B8] text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {INSTRUCTOR.bio}
                  </p>
                </div>
              </div>
            </section>

            {/* About the course */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                About This Course
              </h2>
              <p className="text-[#475569] text-sm leading-relaxed mb-5">
                {course.overview}
              </p>

              {course.focusNote && (
                <div className="flex items-start gap-3 bg-[#c0a84f]/6 border border-[#c0a84f]/20 rounded-xl p-4 mb-6">
                  <svg
                    className="w-4 h-4 text-[#c0a84f] shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-[#c0a84f] text-sm font-medium italic">
                    {course.focusNote}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Duration", val: course.duration },
                  {
                    label: "Total Sessions",
                    val: `${course.totalSessions} Live`,
                  },
                  { label: "Session Length", val: course.sessionDuration },
                  { label: "Delivery Mode", val: course.mode },
                  {
                    label: "Concept / Week",
                    val: `${course.conceptSessionsPerWeek} Sessions`,
                  },
                  {
                    label: "Practice / Week",
                    val: `${course.practiceSessionsPerWeek} Sessions`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]"
                  >
                    <div className="text-[#94A3B8] text-[10px] uppercase tracking-wider mb-1">
                      {item.label}
                    </div>
                    <div
                      className="text-[#0e2b49] font-semibold text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <CourseCurriculum
              modules={course.modules}
              totalSessions={course.totalSessions}
              duration={course.duration}
            />

            {/* Who is this for */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Who Is This Course For?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.targetAudience.map((group) => (
                  <div
                    key={group.group}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 hover:border-[#c0a84f]/30 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0e2b49] to-[#133a67] flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-[#c0a84f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-[#0e2b49] font-semibold text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {group.group}
                      </span>
                    </div>
                    <ul className="space-y-2 pl-0.5">
                      {group.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#c0a84f]/60 mt-1.5" />
                          <span className="text-[#64748B] text-xs leading-relaxed">
                            {pt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Certification */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2
                className="text-xl font-bold text-[#0e2b49] mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Certification
              </h2>
              <p className="text-[#94A3B8] text-sm mb-5">
                Earn a UNIK Academy certificate based on your performance and
                dedication throughout the program.
              </p>
              <div className="space-y-3">
                {CERT_TIERS.map((cert) => (
                  <div
                    key={cert.tier}
                    className={`flex items-center justify-between border rounded-xl px-4 py-3 ${cert.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${cert.color}20` }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: cert.color }}
                        >
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{
                          color: cert.color,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        UNIK {cert.tier} Certification
                      </span>
                    </div>
                    <span className="text-sm text-[#475569] font-medium tabular-nums">
                      {cert.range}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[#94A3B8] text-xs italic mt-4">
                Certification reflects overall performance and active
                participation. All doubts are resolved during live sessions in
                real-time.
              </p>
            </section>
          </div>

          {/* ─── Sticky Sidebar ─── */}
          <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(14,43,73,0.08)] overflow-hidden">
                <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] px-5 pt-5 pb-6">
                  <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1.5">
                    Starting From
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white/40 text-sm line-through tabular-nums">
                      {computeMRP(startingFrom)}
                    </span>
                    <span
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {startingFrom}
                    </span>
                  </div>
                  <p className="text-[#c0a84f] text-xs font-medium">
                    3 session formats available
                  </p>
                </div>

                {/* Session formats */}
                <div className="px-5 py-4 border-b border-[#E2E8F0] space-y-2">
                  {activeFormats.map((sf) => (
                    <div
                      key={sf.label}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#0e2b49] font-semibold text-sm">
                          {sf.label}
                        </span>
                        <span className="text-[10px] text-[#c0a84f] font-semibold bg-[#c0a84f]/10 px-2 py-0.5 rounded-full">
                          {sf.badge}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[#0e2b49]/40 text-xs line-through tabular-nums">
                          {computeMRP(sf.price)}
                        </span>
                        <span className="text-[#0e2b49] font-bold text-sm tabular-nums">
                          {sf.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="p-5 space-y-3">
                  <Link
                    href={`/enroll?course=${encodeURIComponent(course.title)}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)] hover:-translate-y-0.5 cursor-pointer text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Enroll Now
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
                  <Link
                    href="/demo"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-[#0e2b49] border-2 border-[#0e2b49] hover:bg-[#0e2b49] hover:text-white transition-all duration-200 cursor-pointer text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Book Free Demo First
                  </Link>
                </div>

                {/* What's included */}
                <div className="px-5 pb-5">
                  <p className="text-[#94A3B8] text-[11px] uppercase tracking-widest font-semibold mb-3">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-2.5">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <svg
                          className="w-3.5 h-3.5 text-[#c0a84f] shrink-0"
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
                        <span className="text-[#475569] text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Certified Program" },
                  { label: "500+ Students" },
                  { label: "4.9★ Rating" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-3 text-center"
                  >
                    <p className="text-[#0e2b49] text-[10px] font-semibold leading-tight">
                      {b.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile CTA — shown below sidebar on mobile */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 flex gap-3">
                <Link
                  href="/demo"
                  className="flex-1 py-3 rounded-xl font-semibold text-[#0e2b49] border-2 border-[#0e2b49] text-sm text-center hover:bg-[#0e2b49] hover:text-white transition-all duration-200 cursor-pointer"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Free Demo
                </Link>
                <Link
                  href={`/enroll?course=${encodeURIComponent(course.title)}`}
                  className="flex-1 py-3 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-sm text-center shadow-md cursor-pointer"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
