"use client";

import Link from "next/link";
import { CourseIcon } from "@/lib/courseIcons";
import { getCourseSlug } from "../data/courseDetails";

interface Course {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
}

interface Props {
  courses: Course[];
}

export default function HorizontalCourses({ courses }: Props) {
  if (courses.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background:
          "linear-gradient(160deg, #060d18 0%, #0e2b49 55%, #0a1f38 100%)",
      }}
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(192,168,79,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          <div>
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Core{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Courses
              </span>
            </h2>
            <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-[#c0a84f] to-[#d4bc72]" />
          </div>
          <p className="text-white/45 text-base max-w-xs md:text-right leading-relaxed">
            Comprehensive programs that unlock your full communication
            potential.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course, i) => {
            const slug = getCourseSlug(course.title);
            return (
              <Link
                key={course._id}
                href={slug ? `/courses/${slug}` : "#"}
                aria-label={`View details for ${course.title}`}
                className="group relative flex flex-col rounded-2xl p-6 border border-white/8 transition-all duration-300 hover:border-[#c0a84f]/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_0_1px_rgba(192,168,79,0.15)] cursor-pointer"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Ghost number */}
                <span
                  className="absolute top-4 right-5 font-bold leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-[0.06]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "56px",
                    color: "#c0a84f",
                  }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(192,168,79,0.18) 0%, rgba(212,188,114,0.10) 100%)",
                    border: "1px solid rgba(192,168,79,0.25)",
                    color: "#c0a84f",
                  }}
                >
                  <CourseIcon iconKey={course.iconKey} className="w-5 h-5" />
                </div>

                {/* Course number label */}
                <p className="text-[10px] font-mono font-bold text-[#c0a84f]/50 uppercase tracking-widest mb-2">
                  Course {String(i + 1).padStart(2, "0")}
                </p>

                {/* Title */}
                <h3
                  className="text-base font-semibold text-white mb-2 leading-snug"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {course.title}
                </h3>

                {/* Gold divider */}
                <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] mb-3 transition-all duration-500 group-hover:w-14" />

                {/* Description */}
                <p className="text-white/45 text-sm leading-relaxed flex-1">
                  {course.description}
                </p>

                {/* CTA */}
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c0a84f] group-hover:text-white transition-colors duration-200 self-start" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Explore Course
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
