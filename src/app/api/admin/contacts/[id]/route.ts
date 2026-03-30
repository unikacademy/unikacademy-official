import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Contact from '@/models/Contact';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { status: body.status } },
      { new: true, runValidators: false },
    );
    if (!contact) return err('Contact not found', 404);
    return ok(contact);
  }, 'update contact status');
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) return err('Contact not found', 404);
    return ok({ message: 'Contact deleted' });
  }, 'delete contact');
}
