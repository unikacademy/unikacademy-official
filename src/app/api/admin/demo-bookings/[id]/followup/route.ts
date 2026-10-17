import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { updateFollowup } from "@/modules/demo-bookings/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("demos:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(() => updateFollowup(id, body), "update demo follow-up");
}
