"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CourseIcon } from "@/lib/courseIcons";
import { getCourseSlug } from "../data/courseDetails";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || courses.length === 0) return;

      // Only apply horizontal scroll on desktop
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const scrollAmount = track.scrollWidth - window.innerWidth + 64;
        if (scrollAmount <= 0) return;

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          pin: true,
          scrub: 2.5,
          anticipatePin: 1,
          animation: gsap.to(track, {
            x: -scrollAmount,
            ease: "none",
            force3D: true,
          }),
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [courses.length] },
  );

  if (courses.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#F8FAFC] md:overflow-hidden">
      {/* Header — stays visible while track scrolls */}
      <div className="pt-14 md:pt-20 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
          What We Offer
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Core Courses
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full" />
          </div>
          <p className="text-[#64748B] text-lg max-w-sm md:text-right leading-relaxed">
            Comprehensive programs that unlock your full communication
            potential.
          </p>
        </div>

        {/* Desktop scroll hint */}
        <div className="hidden md:flex items-center gap-2 mt-6 text-[#94A3B8] text-sm">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
          Scroll to explore all courses
        </div>
      </div>

      {/* Horizontal track — swipe on mobile, GSAP-pinned on desktop */}
      <div className="overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
        <div
          ref={trackRef}
          className="flex gap-5 px-6 md:px-12 pb-16"
          style={{ width: "max-content", willChange: "transform" }}
        >
          {courses.map((course, i) => (
            <div
              key={course._id}
              className="flex-shrink-0 w-[280px] md:w-[320px] group bg-white rounded-2xl p-7 border border-[#E2E8F0] hover:border-[#c0a84f]/50 hover:shadow-[0_12px_48px_rgba(14,43,73,0.1)] transition-all duration-300 flex flex-col"
            >
              {/* Course number */}
              <div className="text-[#c0a84f]/40 text-xs font-mono font-bold mb-4 uppercase tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0e2b49]/8 to-[#133a67]/12 flex items-center justify-center text-[#0e2b49] mb-5 group-hover:from-[#c0a84f]/15 group-hover:to-[#d4bc72]/20 group-hover:text-[#c0a84f] transition-all duration-300">
                <CourseIcon iconKey={course.iconKey} className="w-6 h-6" />
              </div>

              <h3
                className="text-lg font-semibold text-[#0e2b49] mb-3 leading-snug"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {course.title}
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed flex-1">
                {course.description}
              </p>

              {/* Bottom accent line + Show More link */}
              <div className="mt-6 flex items-center justify-between">
                <div className="w-0 h-0.5 bg-linear-to-r from-[#c0a84f] to-[#d4bc72] rounded-full group-hover:w-12 transition-all duration-500" />
                {getCourseSlug(course.title) ? (
                  <Link
                    href={`/courses/${getCourseSlug(course.title)}`}
                    aria-label={`Show details for ${course.title}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#c0a84f] hover:text-[#0e2b49] border border-[#c0a84f]/30 hover:border-[#0e2b49]/40 hover:bg-[#0e2b49]/5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Show More
                    <svg
                      className="w-3 h-3"
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
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
