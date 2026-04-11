import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unikacademy.in"),
  title: {
    default: "UNIK Academy – Communication & Personality Development",
    template: "%s | UNIK Academy",
  },
  description:
    "Join UNIK Academy for expert-led courses in Communication Skills, Public Speaking, Spoken English & Personality Development. Book a free demo today.",
  openGraph: {
    siteName: "UNIK Academy",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "UNIK Academy – Empowering Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
