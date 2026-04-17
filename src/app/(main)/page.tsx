import type { Metadata } from "next";
import Link from "next/link";
import HeroCarouselSection from "@/website/components/HeroCarouselSection";
import JourneySection from "@/website/components/JourneySection";
import TestimonialsMarquee from "@/website/components/TestimonialsMarquee";
import HorizontalCoursesWrapper from "@/website/components/HorizontalCoursesWrapper";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";
import SplitHeading from "@/components/animations/SplitHeading";
import CountUp from "@/components/animations/CountUp";
import TiltCard from "@/components/animations/TiltCard";
import MagneticButton from "@/components/animations/MagneticButton";

export const metadata: Metadata = {
  title: "UNIK Academy – Communication & Personality Development",
  description:
    "Join UNIK Academy for expert-led courses in Communication Skills, Public Speaking, Spoken English & Personality Development. Book a free demo today.",
  alternates: { canonical: "https://www.unikacademy.in/" },
  openGraph: {
    title: "UNIK Academy – Communication & Personality Development",
    description:
      "Join UNIK Academy for expert-led courses in Communication Skills, Public Speaking, Spoken English & Personality Development. Book a free demo today.",
    url: "https://www.unikacademy.in/",
    type: "website",
  },
  twitter: {
    title: "UNIK Academy – Communication & Personality Development",
    description:
      "Join UNIK Academy for expert-led courses in Communication Skills, Public Speaking, Spoken English & Personality Development. Book a free demo today.",
  },
};

function charmPrice(price: string): string {
  const num = parseInt(price.replace(/,/g, ""), 10);
  if (!isNaN(num) && num > 0 && num % 1000 === 0) {
    return (num - 1).toLocaleString("en-IN");
  }
  return price;
}

interface DBCourse {
  _id: string;
  title: string;
  description: string;
  category: "core" | "pricing" | "premium";
  iconKey: string;
  price: string;
  features: string[];
  featured: boolean;
  order: number;
}

async function getCourses(): Promise<DBCourse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const allCourses = await getCourses();
  const coreCourses = allCourses.filter((c) => c.category === "core");
  const coursePricing = allCourses.filter((c) => c.category === "pricing");
  const premiumPlans = allCourses.filter((c) => c.category === "premium");

  const stats = [
    { value: "500+", label: "Students Trained" },
    { value: "8", label: "Core Courses" },
    { value: "3", label: "Session Formats" },
    { value: "100%", label: "Dedicated Support" },
  ];

  const benefits = [
    "Expert instructors with years of experience",
    "Personalized attention in every format",
    "Practical, hands-on learning approach",
    "Flexible scheduling to fit your life",
    "Comprehensive curriculum & materials",
    "Affordable pricing for every budget",
  ];

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─── */}
      <HeroCarouselSection courses={[...coursePricing, ...premiumPlans]} />

      {/* ─── Journey (Apple-like pinned horizontal panels) ─── */}
      <JourneySection />

      {/* ─── Stats — Cinematic dark strip ─── */}
      <section className="relative bg-[#080f1a] py-16 md:py-24 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(192,168,79,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <StaggerReveal
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8"
            stagger={0.1}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center py-6 px-4 md:px-10">
                <CountUp
                  target={stat.value}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white block mb-3 [font-family:Poppins,sans-serif]"
                />
                <div className="w-8 h-[2px] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] mx-auto mb-3 rounded-full" />
                <p className="text-white/35 text-xs uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ─── Horizontal Course Track (Apple product scroll) ─── */}
      <HorizontalCoursesWrapper courses={coreCourses} />

      {/* ─── Course Pricing Section ─── */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Affordable Plans
            </p>
            <SplitHeading
              text="Beginner-Friendly Pricing"
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0e2b49] mb-4 [font-family:Poppins,sans-serif]"
            />
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mb-5" />
            <p className="text-[#64748B] max-w-xl mx-auto text-lg">
              Start small, grow big — accessible plans designed for anyone
              beginning their communication journey.
            </p>
          </ScrollReveal>

          {coursePricing.length > 0 ? (
            <StaggerReveal
              className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto"
              stagger={0.12}
            >
              {coursePricing.map((plan) => (
                <TiltCard key={plan._id}>
                  <div
                    className={`relative rounded-2xl p-5 sm:p-8 transition-all duration-300 ${plan.featured ? "bg-gradient-to-br from-[#0e2b49] to-[#133a67] text-white shadow-[0_20px_60px_rgba(14,43,73,0.3)] md:scale-105" : "bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#c0a84f]/30 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)]"}`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-lg whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3
                      className={`text-xl font-bold mb-4 ${plan.featured ? "text-white" : "text-[#0e2b49]"}`}
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {plan.title}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span
                        className={`text-sm font-medium ${plan.featured ? "text-white/60" : "text-[#64748B]"}`}
                      >
                        ₹
                      </span>
                      <span
                        className={`text-5xl font-bold ${plan.featured ? "text-white" : "text-[#0e2b49]"}`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {charmPrice(plan.price)}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed mb-6 ${plan.featured ? "text-white/65" : "text-[#64748B]"}`}
                    >
                      {plan.description}
                    </p>
                    <ul className="space-y-2.5 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <div
                            className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.featured ? "bg-[#c0a84f]/25" : "bg-[#c0a84f]/15"}`}
                          >
                            <svg
                              className="w-2.5 h-2.5 text-[#c0a84f]"
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
                          <span
                            className={`text-sm ${plan.featured ? "text-white/80" : "text-[#475569]"}`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${plan.featured ? "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] shadow-lg" : "border-2 border-[#0e2b49] text-[#0e2b49] hover:bg-[#0e2b49] hover:text-white"}`}
                    >
                      Enroll Now
                    </Link>
                  </div>
                </TiltCard>
              ))}
            </StaggerReveal>
          ) : (
            <p className="text-center text-[#64748B]">
              Pricing plans coming soon.
            </p>
          )}
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-14 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                  Why UNIK
                </p>
                <h2
                  className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-5"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  The UNIK Difference
                </h2>
                <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-7" />
                <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                  We believe strong communication is the foundation of every
                  success story. Our proven approach combines expert instruction
                  with practical application.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3 h-3 text-[#0e2b49]"
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
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
                  <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#c0a84f]/20 rounded-full blur-xl" />
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-[#0e2b49]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Transform Your Future
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">
                      From hesitant speakers to confident communicators — our
                      students achieve remarkable transformations.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { n: "Expert", sub: "Instructors" },
                      { n: "Proven", sub: "Curriculum" },
                      { n: "Flexible", sub: "Scheduling" },
                      { n: "Result", sub: "Oriented" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/8 rounded-xl p-3.5 border border-white/10"
                      >
                        <div
                          className="text-[#c0a84f] font-bold text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.n}
                        </div>
                        <div className="text-white/55 text-xs mt-0.5">
                          {item.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Premium Plans Section ─── */}
      <section
        className="relative overflow-hidden py-14 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0a1f38 0%, #0e2b49 50%, #112d52 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c0a84f]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-5">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Premium Plans
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pick Your{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Session Format
              </span>
            </h2>
            <div
              className="w-14 h-1 rounded-full mx-auto mb-5"
              style={{ background: "linear-gradient(90deg, #c0a84f, #d4bc72)" }}
            />
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              60 live sessions per plan — choose how you learn best.
            </p>
          </ScrollReveal>

          {premiumPlans.length > 0 ? (
            <StaggerReveal
              className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto items-center"
              stagger={0.1}
            >
              {premiumPlans.map((plan) => (
                <TiltCard key={plan._id}>
                  <div
                    className={`relative rounded-2xl p-5 sm:p-8 transition-all duration-300 hover:md:-translate-y-2 ${
                      plan.featured
                        ? "bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] shadow-[0_24px_64px_rgba(192,168,79,0.4)] md:scale-105"
                        : "bg-white/6 border border-white/12 hover:border-[#c0a84f]/50 hover:bg-white/10"
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="px-5 py-1.5 rounded-full text-xs font-bold bg-[#0e2b49] text-[#c0a84f] shadow-xl whitespace-nowrap tracking-wide uppercase">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3
                        className={`text-4xl font-bold mb-0.5 ${plan.featured ? "text-[#0e2b49]" : "text-[#c0a84f]"}`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {plan.title}
                      </h3>
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest ${plan.featured ? "text-[#0e2b49]/60" : "text-white/40"}`}
                      >
                        session format
                      </p>
                    </div>

                    <div
                      className={`flex items-baseline gap-1 mb-5 pb-5 border-b ${plan.featured ? "border-[#0e2b49]/15" : "border-white/10"}`}
                    >
                      <span
                        className={`text-lg font-semibold ${plan.featured ? "text-[#0e2b49]/70" : "text-white/60"}`}
                      >
                        ₹
                      </span>
                      <span
                        className={`text-5xl font-bold ${plan.featured ? "text-[#0e2b49]" : "text-white"}`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {charmPrice(plan.price)}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed mb-6 ${plan.featured ? "text-[#0e2b49]/70" : "text-white/55"}`}
                    >
                      {plan.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? "bg-[#0e2b49]/15" : "bg-[#c0a84f]/20"}`}
                          >
                            <svg
                              className={`w-3 h-3 ${plan.featured ? "text-[#0e2b49]" : "text-[#c0a84f]"}`}
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
                          <span
                            className={`text-sm font-medium ${plan.featured ? "text-[#0e2b49]" : "text-white/75"}`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className={`block w-full text-center py-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                        plan.featured
                          ? "bg-[#0e2b49] text-[#c0a84f] hover:bg-[#133a67] shadow-lg"
                          : "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] shadow-[0_4px_20px_rgba(192,168,79,0.3)] hover:shadow-[0_8px_28px_rgba(192,168,79,0.5)]"
                      }`}
                    >
                      Enroll Now
                    </Link>
                  </div>
                </TiltCard>
              ))}
            </StaggerReveal>
          ) : (
            <p className="text-center text-white/50">
              Premium plans coming soon.
            </p>
          )}

          <p className="text-center text-white/35 text-sm mt-10">
            All plans include 60 live sessions &bull; Weekend classes available
            &bull; No recorded classes
          </p>
        </div>
      </section>

      {/* ─── Free Demo Section ─── */}
      <section className="py-14 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e2b49] to-[#133a67] px-5 py-10 sm:px-8 sm:py-14 md:px-16 shadow-[0_24px_64px_rgba(14,43,73,0.2)]">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#c0a84f]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-5">
                    <span className="w-2 h-2 rounded-full bg-[#c0a84f] animate-pulse" />
                    100% Free — No Commitment
                  </div>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
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
                  <p className="text-white/65 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                    Not sure where to start? Experience our teaching style
                    first-hand with a free 30-minute live demo session — no
                    payment, no pressure.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {[
                      { icon: "🎯", text: "Personalized session just for you" },
                      { icon: "⏱", text: "30 minutes, live & interactive" },
                      { icon: "💸", text: "Completely free, no hidden fees" },
                      { icon: "📅", text: "Flexible — pick your time slot" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-white/75 text-sm">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.4)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.55)] hover:-translate-y-0.5 cursor-pointer text-base"
                  >
                    Book Free Demo Now
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

                <div className="flex justify-center lg:justify-end">
                  <div className="bg-white/8 border border-white/15 rounded-2xl p-8 w-full max-w-sm backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-[#0e2b49]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-white font-semibold"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Demo Session
                        </p>
                        <p className="text-white/50 text-xs">
                          Live &bull; 1-on-1 &bull; 30 min
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Meet your instructor",
                        "Understand your goals",
                        "Get a learning roadmap",
                        "Ask any questions",
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#c0a84f]/20 border border-[#c0a84f]/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#c0a84f] text-xs font-bold">
                              {i + 1}
                            </span>
                          </div>
                          <span className="text-white/70 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-white/50 text-sm">Session fee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 line-through text-sm">
                          ₹499
                        </span>
                        <span
                          className="text-[#c0a84f] font-bold text-lg"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          FREE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Sticky Mobile Demo CTA ─── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-2 bg-gradient-to-t from-[#0e2b49]/95 to-[#0e2b49]/0 backdrop-blur-sm pointer-events-none"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href="/demo"
          className="pointer-events-auto flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] shadow-[0_8px_32px_rgba(192,168,79,0.5)] text-base"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          Book Your Free Demo Session
        </Link>
      </div>

      {/* ─── Testimonials Marquee (infinite auto-scroll) ─── */}
      <TestimonialsMarquee />

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden py-16 md:py-28 bg-[#0e2b49]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#c0a84f]/8 rounded-full blur-3xl pointer-events-none" />

        <ScrollReveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-4">
            Get Started Today
          </p>
          <SplitHeading
            text="Ready to Transform Your Communication Skills?"
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight [font-family:Poppins,sans-serif]"
          />
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join UNIK Academy and take the first step towards personal and
            professional excellence. Your transformation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-semibold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.35)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.5)] cursor-pointer text-base"
              >
                Contact Us Now
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
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/8 transition-all duration-200 cursor-pointer text-base"
              >
                Learn About Us
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
