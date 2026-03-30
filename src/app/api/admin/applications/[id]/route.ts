import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Application from '@/models/Application';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const application = await Application.findByIdAndUpdate(
      id,
      { $set: { status: body.status } },
      { new: true, runValidators: false },
    );
    if (!application) return err('Application not found', 404);
    return ok(application);
  }, 'update application status');
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const application = await Application.findByIdAndDelete(id);
    if (!application) return err('Application not found', 404);
    return ok({ message: 'Application deleted' });
  }, 'delete application');
}
