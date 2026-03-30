import DemoBooking from '@/models/DemoBooking';
import { ok } from '@/lib/api';

export async function getAllDemoBookings() {
  const bookings = await DemoBooking.find().sort({ createdAt: -1 });
  return ok(bookings);
}
