import { withDB } from "@/lib/api";
import { getAllDemoBookings } from "./handler";

export async function GET() {
  return withDB(() => getAllDemoBookings(), "fetch demo bookings");
}
