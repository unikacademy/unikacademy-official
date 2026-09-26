import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { listCourses, createCourse } from "@/modules/courses/server/admin";

export async function GET() {
  return withDB(() => listCourses(), "fetch all courses");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => createCourse(body), "create course");
}
