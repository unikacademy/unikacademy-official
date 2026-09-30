import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { listCourses, createCourse } from "@/modules/courses/server/admin";

export async function GET() {
  const denied = await requirePermission("courses:read");
  if (denied) return denied;

  return withDB(() => listCourses(), "fetch all courses");
}

export async function POST(request: NextRequest) {
  const denied = await requirePermission("courses:manage");
  if (denied) return denied;

  const body = await request.json();
  return withDB(() => createCourse(body), "create course");
}
