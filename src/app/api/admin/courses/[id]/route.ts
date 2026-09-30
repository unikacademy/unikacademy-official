import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { updateCourse, deleteCourse } from "@/modules/courses/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("courses:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(() => updateCourse(id, body), "update course");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("courses:manage");
  if (denied) return denied;

  const { id } = await params;
  return withDB(() => deleteCourse(id), "delete course");
}
