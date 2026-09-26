"use client";

import dynamic from "next/dynamic";

interface Course {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
}

const HorizontalCourses = dynamic(() => import("./HorizontalCourses"), {
  ssr: false,
  loading: () => null,
});

export default function HorizontalCoursesWrapper({
  courses,
}: {
  courses: Course[];
}) {
  return <HorizontalCourses courses={courses} />;
}
