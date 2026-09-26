import { withDB } from "@/lib/api";
import { getAllDemoBookings } from "@/modules/demo-bookings/server/admin";

export async function GET() {
  return withDB(() => getAllDemoBookings(), "fetch demo bookings");
}
