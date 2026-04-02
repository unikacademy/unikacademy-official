import { withDB, ok } from '@/lib/api';
import Course from '@/models/Course';

// Public — returns only active courses, sorted by category order
export async function GET() {
  return withDB(async () => {
    const courses = await Course.find({ isActive: true }).sort({ category: 1, order: 1, createdAt: 1 });
    return ok(courses);
  }, 'fetch active courses');
}
