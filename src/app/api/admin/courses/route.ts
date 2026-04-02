import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Course from '@/models/Course';

export async function GET() {
  return withDB(async () => {
    const courses = await Course.find().sort({ category: 1, order: 1, createdAt: 1 });
    return ok(courses);
  }, 'fetch all courses');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(async () => {
    const { title, description, category, iconKey, price, features, featured, order, isActive } = body;
    if (!title?.trim() || !description?.trim() || !category) {
      return err('title, description, and category are required', 400);
    }
    const course = await Course.create({
      title:       title.trim(),
      description: description.trim(),
      category,
      iconKey:     iconKey ?? 'default',
      price:       price?.trim() ?? '',
      features:    (features ?? []).filter((f: string) => f.trim()),
      featured:    featured ?? false,
      order:       order ?? 0,
      isActive:    isActive ?? true,
    });
    return ok(course, 201);
  }, 'create course');
}
