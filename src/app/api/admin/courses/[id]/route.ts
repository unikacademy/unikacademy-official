import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { updateCourse, deleteCourse } from "@/modules/courses/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(() => updateCourse(id, body), "update course");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(() => deleteCourse(id), "delete course");
}
