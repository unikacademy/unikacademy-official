import type { Metadata } from "next";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "Book a Free Demo Session – UNIK Academy",
  description:
    "Book a free 30-minute live demo session with UNIK Academy. No payment, no commitment — experience our communication training first-hand and get a personalised learning plan.",
  alternates: { canonical: "https://www.unikacademy.in/demo" },
  openGraph: {
    title: "Book a Free Demo Session – UNIK Academy",
    description:
      "Book a free 30-minute live demo session with UNIK Academy. No payment, no commitment — experience our communication training first-hand and get a personalised learning plan.",
    url: "https://www.unikacademy.in/demo",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Free Demo Session – UNIK Academy",
      },
    ],
  },
  twitter: {
    title: "Book a Free Demo Session – UNIK Academy",
    description:
      "Book a free 30-minute live demo session with UNIK Academy. No payment, no commitment — experience our communication training first-hand and get a personalised learning plan.",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}
