import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { submitContact } from "@/modules/contacts/server/submit";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => submitContact(body), "submit contact form");
}
