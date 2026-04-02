import { NextRequest } from 'next/server';
import { withDB, ok, err } from '@/lib/api';
import Course from '@/models/Course';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return withDB(async () => {
    const update: Record<string, unknown> = {};
    if (body.title       !== undefined) update.title       = body.title.trim();
    if (body.description !== undefined) update.description = body.description.trim();
    if (body.category    !== undefined) update.category    = body.category;
    if (body.iconKey     !== undefined) update.iconKey     = body.iconKey;
    if (body.price       !== undefined) update.price       = body.price.trim();
    if (body.features    !== undefined) update.features    = body.features.filter((f: string) => f.trim());
    if (body.featured    !== undefined) update.featured    = body.featured;
    if (body.order       !== undefined) update.order       = body.order;
    if (body.isActive    !== undefined) update.isActive    = body.isActive;

    const course = await Course.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: false });
    if (!course) return err('Course not found', 404);
    return ok(course);
  }, 'update course');
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withDB(async () => {
    const course = await Course.findByIdAndDelete(id);
    if (!course) return err('Course not found', 404);
    return ok({ message: 'Course deleted' });
  }, 'delete course');
}
