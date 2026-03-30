import { withDB } from "@/lib/api";
import { getAllContacts } from "./handler";

export async function GET() {
  return withDB(() => getAllContacts(), "fetch contacts");
}
