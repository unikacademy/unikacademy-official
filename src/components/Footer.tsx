import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  const courses = [
    "Communication Skills",
    "Public Speaking",
    "Spoken English",
    "Personality Development",
    "Business Communication",
  ];

  return (
    <footer className="bg-[#0a2240] text-white">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#c0a84f] via-[#d4bc72] to-[#c0a84f]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] shadow-md">
                <span
                  className="text-[#0e2b49] font-bold text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  U
                </span>
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                UNIK <span className="text-[#c0a84f]">Academy</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Empowering Communication.
              <br />
              Transforming Personalities.
            </p>
            {/* Contact info */}
            <div className="space-y-2.5">
              <a
                href="mailto:unikacademy2025@gmail.com"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#c0a84f] transition-colors duration-200 group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center group-hover:bg-[#c0a84f]/20 transition-colors duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
                <span className="truncate">unikacademy2025@gmail.com</span>
              </a>
              <a
                href="tel:9217196824"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#c0a84f] transition-colors duration-200 group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center group-hover:bg-[#c0a84f]/20 transition-colors duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </span>
                9217196824
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#c0a84f] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c0a84f]/50 group-hover:bg-[#c0a84f] transition-colors duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4
              className="text-sm font-semibold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Courses
            </h4>
            <ul className="space-y-2.5">
              {courses.map((course) => (
                <li
                  key={course}
                  className="text-sm text-white/60 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#c0a84f]/50 flex-shrink-0" />
                  {course}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4
              className="text-sm font-semibold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Get Started
            </h4>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Ready to transform your communication skills? Take the first step
              today.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-lg hover:shadow-[0_4px_20px_rgba(192,168,79,0.3)] cursor-pointer"
            >
              Enroll Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} UNIK Academy. All rights reserved.
          </p>
          <p className="text-sm text-white/40">Created with love</p>
        </div>
      </div>
    </footer>
  );
}
