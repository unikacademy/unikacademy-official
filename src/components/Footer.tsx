import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-accent mb-4">UNIK</h3>
            <p className="text-gray-300">
              Empowering Communication. Transforming Personalities.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-accent transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-accent transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="mailto:unikacademy2025@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  unikacademy2025@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:9217196824"
                  className="hover:text-accent transition-colors"
                >
                  9217196824
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} UNIK Academy. All rights reserved.
          </p>
          <p className="mt-2">
            Created by{" "}
            <a
              href="https://www.thitainfo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors underline"
            >
              ThitaInfo
            </a>{" "}
            with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
