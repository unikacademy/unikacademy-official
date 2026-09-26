import { withDB } from "@/lib/api";
import { getAllApplications } from "@/modules/applications/server/admin";

export async function GET() {
  return withDB(() => getAllApplications(), "fetch applications");
}
