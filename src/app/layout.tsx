import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Geist, Inter, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

// Self-hosted by next/font (no render-blocking request to Google Fonts). The
// families keep their real names, so `font-family: Poppins` / `Inter` in the
// styles keeps working.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
// Dashboard headings only — not worth preloading on the marketing pages.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

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
    <html
      lang="en"
      className={cn(
        "font-sans",
        geist.variable,
        poppins.variable,
        inter.variable,
      )}
    >
      <body className="antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
