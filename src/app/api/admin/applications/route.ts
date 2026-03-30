import { withDB } from "@/lib/api";
import { getAllApplications } from "./handler";

export async function GET() {
  return withDB(() => getAllApplications(), "fetch applications");
}
