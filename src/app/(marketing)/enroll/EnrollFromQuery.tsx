"use client";

import { useSearchParams } from "next/navigation";
import EnrollClient from "./EnrollClient";
import { isPlanId } from "@/modules/courses/constants";
import type { CoursePlanPrices } from "@/modules/courses/server/pricing";

interface Props {
  planPrices: CoursePlanPrices;
  offerActive: boolean;
}

// The enroll form, preselected from ?course= / ?plan= (the links on the course
// pages). Must sit inside a <Suspense> — see enroll/page.tsx.
export default function EnrollFromQuery({ planPrices, offerActive }: Props) {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") ?? undefined;
  const plan = searchParams.get("plan");
  return (
    <EnrollClient
      preSelectedCourse={course}
      preSelectedPlan={isPlanId(plan) ? plan : undefined}
      planPrices={planPrices}
      offerActive={offerActive}
    />
  );
}
