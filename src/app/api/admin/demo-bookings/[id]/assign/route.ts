import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import { assignDemo } from "@/modules/demo-bookings/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("demos:assign");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(() => assignDemo(id, body), "assign demo");
}
