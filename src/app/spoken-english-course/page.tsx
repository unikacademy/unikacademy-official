import type { Metadata } from "next";
import SpokenEnglishLanding from "@/website/components/SpokenEnglishLanding";

export const metadata: Metadata = {
  title: "Speak English Confidently in 30 Days | UNIK Academy",
  description:
    "Join UNIK Academy's Spoken English course — Live classes, interview prep & personality development. Book a free demo today. 500+ students trained, 4.8 rating.",
  alternates: { canonical: "https://www.unikacademy.in/spoken-english-course" },
  openGraph: {
    title: "Speak English Confidently in 30 Days | UNIK Academy",
    description:
      "Live classes, mock interviews & daily speaking practice. 500+ students trained. Book your free demo now.",
    url: "https://www.unikacademy.in/spoken-english-course",
    type: "website",
  },
  twitter: {
    title: "Speak English Confidently in 30 Days | UNIK Academy",
    description:
      "Live classes, mock interviews & daily speaking practice. 500+ students trained. Book your free demo now.",
  },
  robots: { index: true, follow: true },
};

export default function SpokenEnglishCoursePage() {
  return <SpokenEnglishLanding />;
}
