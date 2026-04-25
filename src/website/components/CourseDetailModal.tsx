"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CourseIcon } from "@/lib/courseIcons";
import { AccordionItem } from "./CourseAccordion";
import type { CourseDetailData } from "../data/courseDetails";

interface Props {
  course: { title: string; iconKey: string } | null;
  detail: CourseDetailData | null;
  onClose: () => void;
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

export default function CourseDetailModal({ course, detail, onClose }: Props) {
  useEffect(() => {
    if (!course) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${course.title} course details`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a1a30]/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-xl max-h-[93vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_32px_80px_rgba(10,26,48,0.4)] overflow-hidden flex flex-col unik-modal-panel">
        {/* Drag handle (mobile) */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-br from-[#0e2b49] to-[#133a67] px-5 sm:px-6 py-5 relative overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-40 h-40 bg-[#c0a84f]/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/3 w-24 h-24 bg-[#c0a84f]/6 rounded-full blur-xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center shadow-lg">
                <CourseIcon
                  iconKey={course.iconKey}
                  className="w-5 h-5 text-[#0e2b49]"
                />
              </div>
              <div className="min-w-0">
                <h2
                  className="text-base sm:text-lg font-bold text-white leading-snug"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {course.title}
                </h2>
                {detail && (
                  <p className="text-[#c0a84f] text-[11px] font-medium mt-0.5 truncate">
                    {detail.programType}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close course details"
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {detail && (
            <p className="relative text-white/50 text-[11px] mt-3 italic leading-relaxed">
              {detail.subtitle}
            </p>
          )}

          {/* Quick stats */}
          {detail && (
            <div className="relative flex gap-2.5 mt-4">
              {[
                { label: "Duration", value: detail.duration },
                { label: "Sessions", value: `${detail.totalSessions} Live` },
                { label: "Total Hours", value: `${detail.totalHours}h` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/8 border border-white/12 rounded-xl px-3 py-2.5 text-center flex-1"
                >
                  <div
                    className="text-[#c0a84f] font-bold text-sm leading-none"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable accordion content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
          {detail ? (
            <div>
              {/* Overview */}
              <AccordionItem title="Course Overview" defaultOpen>
                <p className="leading-relaxed">{detail.overview}</p>
                {detail.focusNote && (
                  <p className="mt-3 text-[#c0a84f] font-medium italic text-xs border-l-2 border-[#c0a84f]/40 pl-3">
                    {detail.focusNote}
                  </p>
                )}
              </AccordionItem>

              {/* Structure */}
              <AccordionItem title="Course Structure & Schedule">
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Duration", val: detail.duration },
                    {
                      label: "Total Sessions",
                      val: `${detail.totalSessions} Live`,
                    },
                    { label: "Session Duration", val: detail.sessionDuration },
                    { label: "Mode", val: detail.mode },
                    {
                      label: "Concept / Week",
                      val: `${detail.conceptSessionsPerWeek} Sessions`,
                    },
                    {
                      label: "Practice / Week",
                      val: `${detail.practiceSessionsPerWeek} Sessions`,
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
              </AccordionItem>

              {/* Modules */}
              <AccordionItem
                title={`Course Modules (${detail.modules.length} Weeks)`}
              >
                <div className="space-y-3">
                  {detail.modules.map((mod) => (
                    <div key={mod.week} className="flex gap-3 group/mod">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#c0a84f]/20 to-[#d4bc72]/15 border border-[#c0a84f]/30 flex items-center justify-center mt-0.5">
                        <span className="text-[#c0a84f] text-[10px] font-bold">
                          {mod.week}
                        </span>
                      </div>
                      <div>
                        <div
                          className="text-[#0e2b49] font-semibold text-xs leading-snug"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {mod.topic}
                        </div>
                        <div className="text-[#94A3B8] text-[11px] mt-0.5">
                          {mod.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              {/* Outcomes */}
              <AccordionItem title="Course Outcomes">
                <ul className="space-y-2.5">
                  {detail.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mt-0.5 shadow-sm">
                        <svg
                          className="w-2.5 h-2.5 text-[#0e2b49]"
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
                      <span className="text-[#475569] text-xs leading-relaxed">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              {/* Target Audience */}
              <AccordionItem title="Who Is This Course For?">
                <div className="space-y-4">
                  {detail.targetAudience.map((group) => (
                    <div key={group.group}>
                      <div
                        className="text-[#0e2b49] font-semibold text-xs mb-1.5"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {group.group}
                      </div>
                      <ul className="space-y-1 pl-1">
                        {group.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#c0a84f]/60 mt-1.5" />
                            <span className="text-[#64748B] text-[11px] leading-relaxed">
                              {pt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              {/* Certification */}
              <AccordionItem title="Certification">
                <div className="space-y-2">
                  {CERT_TIERS.map((cert) => (
                    <div
                      key={cert.tier}
                      className={`flex items-center justify-between ${cert.bgClass} border ${cert.borderClass} rounded-xl px-4 py-3`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${cert.iconColor}20` }}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: cert.iconColor }}
                          >
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </div>
                        <span
                          className="font-semibold text-xs"
                          style={{
                            color: cert.textColor,
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          UNIK {cert.tier} Certification
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#475569]">
                        {cert.range}
                      </span>
                    </div>
                  ))}
                  <p className="text-[#94A3B8] text-[11px] italic mt-2">
                    Certification is based on performance and practical
                    application. All doubts are solved during live sessions in
                    real-time.
                  </p>
                </div>
              </AccordionItem>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-[#94A3B8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <p className="text-[#64748B] text-sm font-medium">
                Course details coming soon.
              </p>
              <p className="text-[#94A3B8] text-xs mt-1">
                Contact us to learn more about this course.
              </p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 border-t border-[#E2E8F0] px-5 sm:px-6 py-4 bg-[#FAFBFC]">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_20px_rgba(192,168,79,0.3)] hover:shadow-[0_8px_28px_rgba(192,168,79,0.45)] hover:-translate-y-0.5 text-sm cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}
