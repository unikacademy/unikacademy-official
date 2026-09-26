import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us – UNIK Academy | Get in Touch Today",
  description:
    "Get in touch with UNIK Academy. Have questions about our communication courses or want to enroll? Reach out via email or phone — we reply within 24 hours.",
  alternates: { canonical: "https://www.unikacademy.in/contact" },
  openGraph: {
    title: "Contact Us – UNIK Academy | Get in Touch Today",
    description:
      "Get in touch with UNIK Academy. Have questions about our communication courses or want to enroll? Reach out via email or phone — we reply within 24 hours.",
    url: "https://www.unikacademy.in/contact",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Contact UNIK Academy",
      },
    ],
  },
  twitter: {
    title: "Contact Us – UNIK Academy | Get in Touch Today",
    description:
      "Get in touch with UNIK Academy. Have questions about our communication courses or want to enroll? Reach out via email or phone — we reply within 24 hours.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
