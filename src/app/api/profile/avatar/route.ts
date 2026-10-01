import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { authenticate } from "@/modules/auth/server/session";
import { removeAvatar, setAvatar } from "@/modules/profile/server/profile";

// Body: { path: "<user id>/<file>" } of a photo already uploaded to storage
export async function PUT(request: NextRequest) {
  const { user, denied } = await authenticate();
  if (denied) return denied;

  const body = await request.json();
  return withDB(() => setAvatar(user, body.path), "set profile photo");
}

export async function DELETE() {
  const { user, denied } = await authenticate();
  if (denied) return denied;

  return withDB(() => removeAvatar(user), "remove profile photo");
}
