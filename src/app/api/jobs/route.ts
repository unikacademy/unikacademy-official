import { withDB, ok } from '@/lib/api';
import Job from '@/models/Job';

// Public endpoint — only returns active jobs for the careers page
export async function GET() {
  return withDB(async () => {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    return ok(jobs);
  }, 'fetch active jobs');
}
