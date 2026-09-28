import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { requirePermission } from "@/modules/auth/server/session";
import {
  updateDemoBookingStatus,
  deleteDemoBooking,
} from "@/modules/demo-bookings/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("demos:manage");
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  return withDB(
    () => updateDemoBookingStatus(id, body.status),
    "update demo booking status",
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requirePermission("demos:manage");
  if (denied) return denied;

  const { id } = await params;
  return withDB(() => deleteDemoBooking(id), "delete demo booking");
}
