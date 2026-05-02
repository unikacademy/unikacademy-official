"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const courses = [
  { slug: "business-communication", label: "Business Communication" },
  { slug: "communication-skills", label: "Communication Skills" },
  {
    slug: "communication-skills-intermediate",
    label: "Communication Skills – Intermediate",
  },
  {
    slug: "communication-skills-advanced",
    label: "Communication Skills – Advanced",
  },
  { slug: "basic-communication", label: "Basic Communication" },
  { slug: "personality-development", label: "Personality Development" },
  { slug: "public-speaking", label: "Public Speaking" },
  { slug: "spoken-english-grammar", label: "Spoken English & Grammar" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/careers", label: "We're Hiring" },
  ];

  const isCoursesActive = pathname.startsWith("/courses");

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e2b49]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(14,43,73,0.3)]"
          : "bg-[#0e2b49]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="UNIK Academy Home"
          >
            <div
              aria-hidden="true"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] shadow-md group-hover:shadow-[0_0_16px_rgba(192,168,79,0.45)] transition-all duration-300"
            >
              <span
                className="text-[#0e2b49] font-bold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                U
              </span>
            </div>
            <div aria-hidden="true" className="flex flex-col leading-tight">
              <span
                className="text-lg font-bold tracking-wide text-white group-hover:text-[#c0a84f] transition-colors duration-200"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                UNIK{" "}
                <span className="text-[#c0a84f] group-hover:text-white transition-colors duration-200">
                  Academy
                </span>
              </span>
              <span className="text-[10px] text-white/50 tracking-widest uppercase hidden sm:block">
                Empowering Communication
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            {navLinks.slice(0, 1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  className="relative"
                  whileHover="hovered"
                  initial="rest"
                  animate="rest"
                >
                  <Link
                    href={link.href}
                    className={`relative block px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
                      isActive
                        ? "text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] shadow-md"
                        : "text-white/80 hover:text-[#c0a84f]"
                    }`}
                  >
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-lg bg-[#c0a84f]/10"
                        variants={{
                          rest: { opacity: 0 },
                          hovered: { opacity: 1 },
                        }}
                        transition={{ duration: 0.18 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                  {!isActive && (
                    <motion.span
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#c0a84f] via-[#d4bc72] to-[#c0a84f]"
                      variants={{
                        rest: { scaleX: 0, opacity: 0 },
                        hovered: { scaleX: 1, opacity: 1 },
                      }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{ originX: 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Courses Dropdown */}
            <motion.div
              ref={dropdownRef}
              className="relative"
              whileHover="hovered"
              initial="rest"
              animate="rest"
              onMouseEnter={() => setCoursesOpen(true)}
              onMouseLeave={() => setCoursesOpen(false)}
            >
              <button
                className={`relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
                  isCoursesActive
                    ? "text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] shadow-md"
                    : "text-white/80 hover:text-[#c0a84f]"
                }`}
              >
                {!isCoursesActive && (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-[#c0a84f]/10"
                    variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }}
                    transition={{ duration: 0.18 }}
                  />
                )}
                <span className="relative">Courses</span>
                <svg
                  className={`relative w-3.5 h-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
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
              {!isCoursesActive && (
                <motion.span
                  className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#c0a84f] via-[#d4bc72] to-[#c0a84f]"
                  variants={{
                    rest: { scaleX: 0, opacity: 0 },
                    hovered: { scaleX: 1, opacity: 1 },
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{ originX: 0.5 }}
                />
              )}

              <AnimatePresence>
                {coursesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-72 bg-[#0e2b49] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
                  >
                    {courses.map((course, i) => {
                      const isActive = pathname === `/courses/${course.slug}`;
                      return (
                        <Link
                          key={course.slug}
                          href={`/courses/${course.slug}`}
                          onClick={() => setCoursesOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 border-b border-white/5 last:border-0 ${
                            isActive
                              ? "text-[#c0a84f] bg-white/8 font-semibold"
                              : "text-white/80 hover:text-[#c0a84f] hover:bg-white/6"
                          }`}
                        >
                          <span className="shrink-0 w-5 h-5 rounded-md bg-gradient-to-br from-[#c0a84f]/30 to-[#d4bc72]/10 flex items-center justify-center text-[10px] font-bold text-[#c0a84f]">
                            {i + 1}
                          </span>
                          {course.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remaining links: About Us, Contact Us, We're Hiring */}
            {navLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  className="relative"
                  whileHover="hovered"
                  initial="rest"
                  animate="rest"
                >
                  <Link
                    href={link.href}
                    className={`relative block px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
                      isActive
                        ? "text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] shadow-md"
                        : "text-white/80 hover:text-[#c0a84f]"
                    }`}
                  >
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-lg bg-[#c0a84f]/10"
                        variants={{
                          rest: { opacity: 0 },
                          hovered: { opacity: 1 },
                        }}
                        transition={{ duration: 0.18 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                  {!isActive && (
                    <motion.span
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#c0a84f] via-[#d4bc72] to-[#c0a84f]"
                      variants={{
                        rest: { scaleX: 0, opacity: 0 },
                        hovered: { scaleX: 1, opacity: 1 },
                      }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{ originX: 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Free Demo CTA */}
            <Link
              href="/demo"
              className="ml-2 px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-md hover:shadow-[0_0_18px_rgba(192,168,79,0.45)] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f]"
            >
              Free Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-1">
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
              pathname === "/"
                ? "text-[#c0a84f] bg-white/10 border-l-2 border-[#c0a84f]"
                : "text-white/85 hover:text-[#c0a84f] hover:bg-white/8"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {/* Mobile Courses Accordion */}
          <button
            onClick={() => setMobileCoursesOpen((v) => !v)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
              isCoursesActive
                ? "text-[#c0a84f] bg-white/10 border-l-2 border-[#c0a84f]"
                : "text-white/85 hover:text-[#c0a84f] hover:bg-white/8"
            }`}
          >
            Courses
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${mobileCoursesOpen ? "rotate-180" : ""}`}
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

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              mobileCoursesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-3 pl-3 border-l border-[#c0a84f]/30 space-y-0.5 py-1">
              {courses.map((course, i) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setMobileCoursesOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    pathname === `/courses/${course.slug}`
                      ? "text-[#c0a84f] bg-white/8 font-semibold"
                      : "text-white/70 hover:text-[#c0a84f] hover:bg-white/6"
                  }`}
                >
                  <span className="flex-shrink-0 w-4 h-4 rounded bg-[#c0a84f]/20 flex items-center justify-center text-[9px] font-bold text-[#c0a84f]">
                    {i + 1}
                  </span>
                  {course.label}
                </Link>
              ))}
            </div>
          </div>

          {/* About Us, Contact Us, We're Hiring */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
                pathname === link.href
                  ? "text-[#c0a84f] bg-white/10 border-l-2 border-[#c0a84f]"
                  : "text-white/85 hover:text-[#c0a84f] hover:bg-white/8"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Free Demo CTA */}
          <Link
            href="/demo"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center mt-2 px-4 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f]"
          >
            Book Free Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
