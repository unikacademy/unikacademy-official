import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import {
  updateApplicationStatus,
  deleteApplication,
} from "@/modules/applications/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("applications:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(
    () => updateApplicationStatus(id, body.status),
    "update application status",
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("applications:manage");
  if (denied) return denied;

  const { id } = await params;
  return withDB(() => deleteApplication(id), "delete application");
}
