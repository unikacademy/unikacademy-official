import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with UNIK Academy. Have questions about our courses or want to know more? We'd love to hear from you.",
  alternates: { canonical: "https://www.unikacademy.in/contact" },
  openGraph: {
    title: "Contact Us | UNIK Academy",
    description:
      "Get in touch with UNIK Academy. Have questions about our courses or want to know more? We'd love to hear from you.",
    url: "https://www.unikacademy.in/contact",
    type: "website",
  },
  twitter: {
    title: "Contact Us | UNIK Academy",
    description:
      "Get in touch with UNIK Academy. Have questions about our courses or want to know more? We'd love to hear from you.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
