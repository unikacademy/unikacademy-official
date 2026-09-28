import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { updateJob, deleteJob } from "@/modules/jobs/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("jobs:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(() => updateJob(id, body), "update job");
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("jobs:manage");
  if (denied) return denied;

  const { id } = await params;
  return withDB(() => deleteJob(id), "delete job");
}
