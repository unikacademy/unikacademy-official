import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { loginAdmin } from "./handler";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => loginAdmin(body), "login");
}
