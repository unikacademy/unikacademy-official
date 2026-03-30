import { NextRequest } from 'next/server';
import { withDB } from '@/lib/api';
import { submitDemoBooking } from './handler';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withDB(() => submitDemoBooking(body), 'submit demo booking');
}
