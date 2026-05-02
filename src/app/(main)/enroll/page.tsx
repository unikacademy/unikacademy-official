import type { Metadata } from "next";
import EnrollClient from "./EnrollClient";

export const metadata: Metadata = {
  title: "Enroll in a Course – UNIK Academy | Live Communication Training",
  description:
    "Choose your learning plan at UNIK Academy. Pick from 1-on-1, 1-to-2, or group sessions. Start your communication skills, personality development, or public speaking journey today.",
  alternates: { canonical: "https://www.unikacademy.in/enroll" },
  openGraph: {
    title: "Enroll in a Course – UNIK Academy",
    description:
      "Choose your learning plan at UNIK Academy. Pick from 1-on-1, 1-to-2, or group sessions. Start your communication journey today.",
    url: "https://www.unikacademy.in/enroll",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Enroll – UNIK Academy",
      },
    ],
  },
  twitter: {
    title: "Enroll in a Course – UNIK Academy",
    description:
      "Choose your learning plan at UNIK Academy. Pick from 1-on-1, 1-to-2, or group sessions. Start your communication journey today.",
  },
};

interface Props {
  searchParams: Promise<{ course?: string }>;
}

export default async function EnrollPage({ searchParams }: Props) {
  const { course } = await searchParams;
  return <EnrollClient preSelectedCourse={course} />;
}
