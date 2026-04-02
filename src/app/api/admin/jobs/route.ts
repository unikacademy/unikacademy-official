import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Job from '@/models/Job';

export async function GET() {
  return withDB(async () => {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return ok(jobs);
  }, 'fetch all jobs');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(async () => {
    const { title, type, workMode, responsibilities, eligibility, isActive } = body;
    if (!title?.trim() || !type?.trim() || !workMode?.trim()) {
      return err('title, type, and workMode are required', 400);
    }
    const job = await Job.create({
      title: title.trim(),
      type: type.trim(),
      workMode: workMode.trim(),
      responsibilities: (responsibilities ?? []).filter((r: string) => r.trim()),
      eligibility: (eligibility ?? []).filter((e: string) => e.trim()),
      isActive: isActive ?? true,
    });
    return ok(job, 201);
  }, 'create job');
}
