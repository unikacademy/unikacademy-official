import type { Metadata } from "next";
import { Suspense } from "react";
import EnrollClient from "./EnrollClient";
import EnrollFromQuery from "./EnrollFromQuery";
import { getCoursePlanPrices } from "@/modules/courses/server/pricing";
import { isOfferActive } from "@/modules/courses/offer";

export const metadata: Metadata = {
  title: "Enroll in a Course – UNIK Academy | Live Communication Training",
  description:
    "Choose your learning plan at UNIK Academy. Book personalised 1-on-1 live sessions. Start your communication skills, personality development, or public speaking journey today.",
  alternates: { canonical: "https://www.unikacademy.in/enroll" },
  openGraph: {
    title: "Enroll in a Course – UNIK Academy",
    description:
      "Choose your learning plan at UNIK Academy. Book personalised 1-on-1 live sessions. Start your communication journey today.",
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
      "Choose your learning plan at UNIK Academy. Book personalised 1-on-1 live sessions. Start your communication journey today.",
  },
};

// Course prices come from Supabase — see the note in courses/[slug]/page.tsx.
export const revalidate = 60;

// ?course= / ?plan= are read in the browser (EnrollFromQuery) rather than from
// `searchParams` here, which would force a server render on every visit. The
// fallback is the same form without a preselection, so it is in the static HTML.
export default async function EnrollPage() {
  const planPrices = await getCoursePlanPrices();
  const offerActive = isOfferActive();
  return (
    <Suspense
      fallback={
        <EnrollClient planPrices={planPrices} offerActive={offerActive} />
      }
    >
      <EnrollFromQuery planPrices={planPrices} offerActive={offerActive} />
    </Suspense>
  );
}
