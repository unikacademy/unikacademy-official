import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Job from '@/models/Job';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const update: Record<string, unknown> = {};
    if (body.title     !== undefined) update.title            = body.title.trim();
    if (body.type      !== undefined) update.type             = body.type.trim();
    if (body.workMode  !== undefined) update.workMode         = body.workMode.trim();
    if (body.responsibilities !== undefined) update.responsibilities = body.responsibilities.filter((r: string) => r.trim());
    if (body.eligibility     !== undefined) update.eligibility      = body.eligibility.filter((e: string) => e.trim());
    if (body.isActive  !== undefined) update.isActive         = body.isActive;

    const job = await Job.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: false });
    if (!job) return err('Job not found', 404);
    return ok(job);
  }, 'update job');
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const job = await Job.findByIdAndDelete(id);
    if (!job) return err('Job not found', 404);
    return ok({ message: 'Job deleted' });
  }, 'delete job');
}
