import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { authenticate } from "@/modules/auth/server/session";
import { updateProfile } from "@/modules/profile/server/profile";

// Any logged-in user may update their own profile
export async function PATCH(request: NextRequest) {
  const { user, denied } = await authenticate();
  if (denied) return denied;

  const body = await request.json();
  return withDB(() => updateProfile(user, body), "update profile");
}
