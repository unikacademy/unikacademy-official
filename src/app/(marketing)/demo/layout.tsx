import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Demo Class",
  description:
    "Book your free 30-minute live demo session at UNIK Academy. No payment, no commitment — experience expert communication training firsthand.",
  alternates: { canonical: "https://www.unikacademy.in/demo" },
  openGraph: {
    title: "Book a Free Demo Class | UNIK Academy",
    description:
      "Book your free 30-minute live demo session at UNIK Academy. No payment, no commitment — experience expert communication training firsthand.",
    url: "https://www.unikacademy.in/demo",
    type: "website",
  },
  twitter: {
    title: "Book a Free Demo Class | UNIK Academy",
    description:
      "Book your free 30-minute live demo session at UNIK Academy. No payment, no commitment — experience expert communication training firsthand.",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
