import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { courseDetailsData } from "@/website/data/courseDetails";
import { AccordionGroup } from "@/website/components/CourseAccordion";
import type { AccordionGroupItem } from "@/website/components/CourseAccordion";

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
  return {
    title: `${course.title} | UNIK Academy`,
    description: course.overview,
    alternates: { canonical: `https://www.unikacademy.in/courses/${slug}` },
    openGraph: {
      title: `${course.title} | UNIK Academy`,
      description: course.overview,
      url: `https://www.unikacademy.in/courses/${slug}`,
      type: "website",
    },
  };
}

const CERT_TIERS = [
  {
    tier: "Gold",
    range: "Above 80%",
    iconColor: "#c0a84f",
    bgClass: "bg-[#c0a84f]/10",
    borderClass: "border-[#c0a84f]/25",
    textColor: "#b8960d",
  },
  {
    tier: "Silver",
    range: "70% – 80%",
    iconColor: "#94A3B8",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-200",
    textColor: "#64748B",
  },
  {
    tier: "Bronze",
    range: "60% – 70%",
    iconColor: "#b45309",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    textColor: "#92400e",
  },
];

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = courseDetailsData.find((c) => c.id === slug);
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ── */}
      <div className="relative bg-linear-to-br from-[#0a1f38] via-[#0e2b49] to-[#112d52] overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#c0a84f]/6 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          {/* Back */}
          <Link
            href="/#courses"
            className="flex w-fit items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors duration-200 mb-8 group"
          >
            <svg
              className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Courses
          </Link>

          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-[11px] font-semibold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f]" />
            UNIK Academy
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {course.title}
          </h1>
          <p className="text-[#c0a84f] text-sm font-medium mb-2">
            {course.programType}
          </p>
          <p className="text-white/45 text-sm italic mb-8">{course.subtitle}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Duration", value: course.duration },
              { label: "Live Sessions", value: String(course.totalSessions) },
              { label: "Total Hours", value: `${course.totalHours}h` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/8 border border-white/10 rounded-xl px-3 py-3 text-center"
              >
                <div
                  className="text-[#c0a84f] font-bold text-base sm:text-lg leading-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Accordion Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-6 py-1">
            <AccordionGroup
              defaultOpenIndex={0}
              items={[
                {
                  title: "Course Overview",
                  content: (
                    <>
                      <p className="leading-relaxed text-[#475569]">
                        {course.overview}
                      </p>
                      {course.focusNote && (
                        <p className="mt-3 text-[#c0a84f] font-medium italic text-xs border-l-2 border-[#c0a84f]/40 pl-3">
                          {course.focusNote}
                        </p>
                      )}
                    </>
                  ),
                },
                {
                  title: "Course Structure & Schedule",
                  content: (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: "Duration", val: course.duration },
                        { label: "Total Sessions", val: `${course.totalSessions} Live` },
                        { label: "Session Duration", val: course.sessionDuration },
                        { label: "Mode", val: course.mode },
                        { label: "Concept / Week", val: `${course.conceptSessionsPerWeek} Sessions` },
                        { label: "Practice / Week", val: `${course.practiceSessionsPerWeek} Sessions` },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                          <div className="text-[#94A3B8] text-[10px] uppercase tracking-wider mb-1">
                            {item.label}
                          </div>
                          <div className="text-[#0e2b49] font-semibold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {item.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  title: `Course Modules (${course.modules.length} Weeks)`,
                  content: (
                    <div className="space-y-3">
                      {course.modules.map((mod) => (
                        <div key={mod.week} className="flex gap-3">
                          <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-[#c0a84f]/20 to-[#d4bc72]/15 border border-[#c0a84f]/30 flex items-center justify-center mt-0.5">
                            <span className="text-[#c0a84f] text-[10px] font-bold">{mod.week}</span>
                          </div>
                          <div>
                            <div className="text-[#0e2b49] font-semibold text-xs leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>
                              {mod.topic}
                            </div>
                            <div className="text-[#94A3B8] text-[11px] mt-0.5">{mod.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Course Outcomes",
                  content: (
                    <ul className="space-y-2.5">
                      {course.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="shrink-0 w-4 h-4 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mt-0.5 shadow-sm">
                            <svg className="w-2.5 h-2.5 text-[#0e2b49]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <span className="text-[#475569] text-sm leading-relaxed">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "Who Is This Course For?",
                  content: (
                    <div className="space-y-5">
                      {course.targetAudience.map((group) => (
                        <div key={group.group}>
                          <div className="text-[#0e2b49] font-semibold text-sm mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {group.group}
                          </div>
                          <ul className="space-y-1.5 pl-1">
                            {group.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#c0a84f]/60 mt-2" />
                                <span className="text-[#64748B] text-sm">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Certification",
                  content: (
                    <div className="space-y-2.5">
                      {CERT_TIERS.map((cert) => (
                        <div key={cert.tier} className={`flex items-center justify-between ${cert.bgClass} border ${cert.borderClass} rounded-xl px-4 py-3`}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${cert.iconColor}20` }}>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: cert.iconColor }}>
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-sm" style={{ color: cert.textColor, fontFamily: "Poppins, sans-serif" }}>
                              UNIK {cert.tier} Certification
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[#475569]">{cert.range}</span>
                        </div>
                      ))}
                      <p className="text-[#94A3B8] text-xs italic mt-2">
                        Certification is based on performance and practical application. All doubts are solved during live sessions in real-time.
                      </p>
                    </div>
                  ),
                },
              ] satisfies AccordionGroupItem[]}
            />
          </div>
        </div>

        {/* Enroll CTA */}
        <div className="mt-6">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-bold text-[#0e2b49] bg-linear-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.35)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.5)] hover:-translate-y-0.5 text-base cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Enroll Now — Limited Seats Available
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
          <p className="text-center text-[#94A3B8] text-xs mt-3">
            {course.mode} &bull; {course.totalSessions} Sessions &bull;{" "}
            {course.sessionDuration} each
          </p>
        </div>
      </div>
    </div>
  );
}
