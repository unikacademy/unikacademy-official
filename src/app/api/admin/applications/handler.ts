import Application from "@/models/Application";
import { ok } from "@/lib/api";

export async function getAllApplications() {
  const applications = await Application.find().sort({ createdAt: -1 });
  return ok(applications);
}
