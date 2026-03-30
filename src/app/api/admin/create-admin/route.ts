import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { createAdmin } from "./handler";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => createAdmin(body), "create admin user");
}
