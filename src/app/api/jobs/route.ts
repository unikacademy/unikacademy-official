import { withDB } from "@/lib/api";
import { listActiveJobs } from "@/modules/jobs/server/public";

export async function GET() {
  return withDB(() => listActiveJobs(), "fetch active jobs");
}
