import DemoBooking from '@/models/DemoBooking';
import { ok, err } from '@/lib/api';

export async function submitDemoBooking(body: {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  message?: string;
}) {
  const { name, email, phone, course, message } = body;

  if (!name || !phone || !course) {
    return err('Name, phone, and course are required', 400);
  }

  await new DemoBooking({ name, email, phone, course, message }).save();

  return ok({ message: 'Demo booking submitted successfully' }, 201);
}
