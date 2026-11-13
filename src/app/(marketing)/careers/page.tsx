import type { Metadata } from "next";
import { CareersClient } from "./CareersClient";
import { getActiveJobs } from "@/modules/jobs/server/public";

export const metadata: Metadata = {
  title: "Careers at UNIK Academy – Join Our Teaching Team",
  description:
    "Explore job opportunities at UNIK Academy. Join our team of passionate educators and help students master communication skills and personality development.",
  alternates: { canonical: "https://www.unikacademy.in/careers" },
  openGraph: {
    title: "Careers at UNIK Academy – Join Our Teaching Team",
    description:
      "Explore job opportunities at UNIK Academy. Join our team of passionate educators and help students master communication skills and personality development.",
    url: "https://www.unikacademy.in/careers",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Careers at UNIK Academy",
      },
    ],
  },
  twitter: {
    title: "Careers at UNIK Academy – Join Our Teaching Team",
    description:
      "Explore job opportunities at UNIK Academy. Join our team of passionate educators and help students master communication skills and personality development.",
  },
};

interface Job {
  _id: string;
  title: string;
  type: string;
  workMode: string;
  responsibilities: string[];
  eligibility: string[];
}

// Jobs come from Supabase; re-generate at most once a minute so jobs published
// in the dashboard show up without a redeploy.
export const revalidate = 60;

async function getJobs(): Promise<Job[]> {
  try {
    return (await getActiveJobs()) as unknown as Job[];
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();
  return <CareersClient jobs={jobs} />;
}
