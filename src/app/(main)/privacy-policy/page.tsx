import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read UNIK Academy's Privacy Policy to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://www.unikacademy.in/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | UNIK Academy",
    description:
      "Read UNIK Academy's Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: "https://www.unikacademy.in/privacy-policy",
    type: "website",
  },
  twitter: {
    title: "Privacy Policy | UNIK Academy",
    description:
      "Read UNIK Academy's Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-primary text-center mb-4">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Last updated: April 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              UNIK Academy (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              is committed to protecting your personal information. This Privacy
              Policy explains what data we collect when you visit{" "}
              <strong>www.unikacademy.in</strong>, how we use it, and the
              choices you have. By using our website or submitting any form, you
              agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information only when you voluntarily provide it
              through our contact or demo-booking forms:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Full Name</strong> — to address you personally
              </li>
              <li>
                <strong>Phone Number</strong> — to confirm your demo session or
                respond to your query
              </li>
              <li>
                <strong>Email Address</strong> — to send booking confirmations
                and course information
              </li>
              <li>
                <strong>Course Interest &amp; Message</strong> — to tailor our
                response to your specific needs
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We also automatically collect standard server logs (IP address,
              browser type, pages visited) via Vercel Analytics to understand
              general traffic patterns. This data is anonymous and not linked to
              your identity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To confirm and schedule your free demo session</li>
              <li>To respond to your enquiries via phone or email</li>
              <li>To send information about our courses and updates</li>
              <li>
                To improve our website and services based on usage patterns
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do <strong>not</strong> use your data for automated
              decision-making or profiling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              4. Data Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do <strong>not</strong> sell, trade, or rent your personal
              information to third parties. Your data is stored securely in our
              database (Supabase) and is accessible only to authorised UNIK
              Academy staff. We use reputable third-party services (Vercel,
              Supabase) that process data on our behalf under strict
              confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your submitted information for as long as necessary to
              fulfil the purpose for which it was collected (e.g., scheduling
              your demo session, responding to your query). You may request
              deletion of your data at any time by emailing us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              6. Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website uses minimal cookies necessary for the site to
              function (session management). We also use Vercel Analytics which
              may set anonymous analytics cookies. We do not use advertising or
              tracking cookies. You can disable cookies in your browser settings
              without affecting most site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under applicable Indian data protection laws, you have the right
              to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent to future communications at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:unikacademy2025@gmail.com"
                className="text-accent hover:underline"
              >
                unikacademy2025@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              8. Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We take reasonable technical and organisational measures to
              protect your data from unauthorised access, loss, or misuse. Our
              website is served over HTTPS and our database is secured with
              role-based access controls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. The
              &quot;Last updated&quot; date at the top of this page will reflect
              any changes. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-medium mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="mt-4 bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-semibold">UNIK Academy</p>
              <p className="text-gray-600 mt-1">
                Email:{" "}
                <a
                  href="mailto:unikacademy2025@gmail.com"
                  className="text-accent hover:underline"
                >
                  unikacademy2025@gmail.com
                </a>
              </p>
              <p className="text-gray-600 mt-1">
                Phone:{" "}
                <a
                  href="tel:9217196824"
                  className="text-accent hover:underline"
                >
                  9217196824
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
