import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read UNIK Academy's terms and conditions governing the use of our website, services, and course enrollment.",
  alternates: { canonical: "https://www.unikacademy.in/terms" },
  openGraph: {
    title: "Terms & Conditions | UNIK Academy",
    description:
      "Read UNIK Academy's terms and conditions governing the use of our website, services, and course enrollment.",
    url: "https://www.unikacademy.in/terms",
    type: "website",
  },
  twitter: {
    title: "Terms & Conditions | UNIK Academy",
    description:
      "Read UNIK Academy's terms and conditions governing the use of our website, services, and course enrollment.",
  },
};

export default function Terms() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-primary text-center mb-12">
          Terms and Conditions
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              Please read these Terms and Conditions carefully before using UNIK
              Academy&apos;s services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using UNIK Academy&apos;s website and services,
              you accept and agree to be bound by the terms and provision of
              this agreement. If you do not agree to these terms, please do not
              use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              2. Services
            </h2>
            <p className="text-gray-700 mb-4">
              UNIK Academy provides educational services including but not
              limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Communication Skills Training</li>
              <li>Public Speaking & Presentation Skills</li>
              <li>Spoken English & Grammar</li>
              <li>Personality Development</li>
              <li>Business Communication</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We offer various session formats including 1-on-1, 1-to-2, and
              1-to-5 group sessions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              3. Enrollment and Payment
            </h2>
            <p className="text-gray-700 mb-4">
              Course fees are as listed on our website:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>1-on-1 Sessions: ₹11,999</li>
              <li>1-to-2 Sessions: ₹8,999</li>
              <li>1-to-5 Group Sessions: ₹5,999</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Payment terms and refund policies will be communicated at the time
              of enrollment. All fees are subject to change with prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              4. Student Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">Students are expected to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Attend scheduled sessions punctually</li>
              <li>Complete assigned coursework and exercises</li>
              <li>Maintain respectful behavior during sessions</li>
              <li>Communicate any concerns or issues promptly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              All course materials, content, and resources provided by UNIK
              Academy are protected by intellectual property laws. Students may
              not reproduce, distribute, or share course materials without
              explicit written permission from UNIK Academy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              6. Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We respect your privacy and handle all personal information in
              accordance with applicable data protection laws. Your information
              will be used solely for providing our services and will not be
              shared with third parties without your consent, except as required
              by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              UNIK Academy shall not be liable for any indirect, incidental,
              special, or consequential damages arising from the use of our
              services. While we strive to provide quality education, we do not
              guarantee specific outcomes or results.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              8. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              UNIK Academy reserves the right to modify these terms and
              conditions at any time. Students will be notified of any
              significant changes. Continued use of our services after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-primary-medium mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For questions regarding these Terms and Conditions, please contact
              us:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:unikacademy2025@gmail.com"
                  className="text-accent hover:underline"
                >
                  unikacademy2025@gmail.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:9217196824"
                  className="text-accent hover:underline"
                >
                  9217196824
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">
              By using UNIK Academy&apos;s services, you acknowledge that you
              have read, understood, and agree to be bound by these Terms and
              Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
