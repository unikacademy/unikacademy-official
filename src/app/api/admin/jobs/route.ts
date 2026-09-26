import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { listJobs, createJob } from "@/modules/jobs/server/admin";

export async function GET() {
  return withDB(() => listJobs(), "fetch all jobs");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => createJob(body), "create job");
}
