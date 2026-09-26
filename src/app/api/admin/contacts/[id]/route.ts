import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import {
  updateContactStatus,
  deleteContact,
} from "@/modules/contacts/server/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(
    () => updateContactStatus(id, body.status),
    "update contact status",
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(() => deleteContact(id), "delete contact");
}
