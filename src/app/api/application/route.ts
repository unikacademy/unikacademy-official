import { NextRequest } from "next/server";
import { withDB } from "@/lib/api";
import { submitApplication } from "./handler";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => submitApplication(body), "submit application");
}
