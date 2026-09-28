import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { listJobs, createJob } from "@/modules/jobs/server/admin";

export async function GET() {
  const denied = await requirePermission("jobs:read");
  if (denied) return denied;

  return withDB(() => listJobs(), "fetch all jobs");
}

export async function POST(request: NextRequest) {
  const denied = await requirePermission("jobs:manage");
  if (denied) return denied;

  const body = await request.json();
  return withDB(() => createJob(body), "create job");
}
