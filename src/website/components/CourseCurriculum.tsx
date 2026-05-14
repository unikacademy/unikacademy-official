"use client";

import { useState } from "react";
import type { CourseModule } from "@/website/data/courseDetails";

interface Props {
  modules: CourseModule[];
  totalSessions: number;
  duration: string;
}

export default function CourseCurriculum({ modules, totalSessions, duration }: Props) {
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));

  function toggle(week: number) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-bold text-[#0e2b49]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Course Curriculum
        </h2>
        <span className="text-xs font-medium text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full">
          {duration} · {totalSessions} sessions
        </span>
      </div>

      {/* Week cards */}
      <div className="space-y-2">
        {modules.map((mod) => {
          const isOpen = openWeeks.has(mod.week);
          const points = mod.description
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);

          return (
            <div
              key={mod.week}
              onClick={() => toggle(mod.week)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => e.key === "Enter" && toggle(mod.week)}
              className={`w-full rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                isOpen
                  ? "border-[#c0a84f]/40 bg-[#fffdf5]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#c0a84f]/30 hover:bg-white"
              }`}
            >
              {/* Row header — always visible */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                {/* Week badge */}
                <div
                  className={`shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 ${
                    isOpen
                      ? "bg-gradient-to-br from-[#c0a84f] to-[#d4bc72]"
                      : "bg-gradient-to-br from-[#c0a84f]/15 to-[#d4bc72]/10 border border-[#c0a84f]/25"
                  }`}
                >
                  <span
                    className={`text-[8px] font-bold uppercase leading-none ${isOpen ? "text-[#0e2b49]" : "text-[#c0a84f]"}`}
                  >
                    Week
                  </span>
                  <span
                    className={`text-sm font-extrabold leading-none ${isOpen ? "text-[#0e2b49]" : "text-[#c0a84f]"}`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {mod.week}
                  </span>
                </div>

                {/* Topic */}
                <span
                  className={`flex-1 font-semibold text-sm leading-snug transition-colors duration-150 ${
                    isOpen ? "text-[#c0a84f]" : "text-[#0e2b49]"
                  }`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {mod.topic}
                </span>

                {/* Chevron */}
                <svg
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#c0a84f]" : "text-[#94A3B8]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded points */}
              {isOpen && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-[#c0a84f]/15 pt-3">
                    <ol className="space-y-2">
                      {points.map((point, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[#475569] text-sm leading-relaxed">
                          <span className="text-[#c0a84f] font-bold shrink-0 tabular-nums mt-px text-xs">
                            {j + 1}.
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
