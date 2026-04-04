"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/demo", label: "Free Demo", highlight: true },
    { href: "/careers", label: "We're Hiring" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

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
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] shadow-md group-hover:shadow-[0_0_16px_rgba(192,168,79,0.45)] transition-all duration-300">
              <span
                className="text-[#0e2b49] font-bold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                U
              </span>
            </div>
            <div className="flex flex-col leading-tight">
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
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-md hover:shadow-[0_4px_16px_rgba(192,168,79,0.4)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f]"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] group/link ${
                    pathname === link.href
                      ? "text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] shadow-md"
                      : "text-white/85 hover:text-[#0e2b49] hover:bg-gradient-to-r hover:from-[#c0a84f] hover:to-[#d4bc72] hover:shadow-md"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
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
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c0a84f] ${
                pathname === link.href
                  ? "text-[#c0a84f] bg-white/10 border-l-2 border-[#c0a84f]"
                  : "text-white/85 hover:text-white hover:bg-white/8"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
