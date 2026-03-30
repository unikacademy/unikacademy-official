import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import DemoBooking from '@/models/DemoBooking';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const booking = await DemoBooking.findByIdAndUpdate(
      id,
      { $set: { status: body.status } },
      { new: true, runValidators: false },
    );
    if (!booking) return err('Demo booking not found', 404);
    return ok(booking);
  }, 'update demo booking status');
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const booking = await DemoBooking.findByIdAndDelete(id);
    if (!booking) return err('Demo booking not found', 404);
    return ok({ message: 'Demo booking deleted' });
  }, 'delete demo booking');
}
