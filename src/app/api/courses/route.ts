import { withDB } from "@/lib/api";
import { listActiveCourses } from "@/modules/courses/server/public";

export async function GET() {
  return withDB(() => listActiveCourses(), "fetch active courses");
}
