import type { DemoStage } from "@/modules/demo-bookings/types";

const FINISHED: DemoStage[] = ["completed", "cancelled", "no_show"];

// A demo stays "upcoming" until an hour after its start time, so it doesn't
// jump to "past" while it's still running.
const GRACE_MS = 60 * 60 * 1000;

/** Upcoming = not finished and not long past (unscheduled counts as upcoming). */
export function isUpcomingDemo(
  demo: { demoStatus: DemoStage; scheduledAt: string | null },
  now = Date.now(),
) {
  if (FINISHED.includes(demo.demoStatus)) return false;
  if (!demo.scheduledAt) return true;
  return new Date(demo.scheduledAt).getTime() + GRACE_MS >= now;
}

/** Whole years between a YYYY-MM-DD birth date and today. */
export function ageFrom(dateOfBirth: string | null, now = new Date()) {
  if (!dateOfBirth) return null;
  const dob = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) return null;
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() &&
      now.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age--;
  return age >= 0 ? age : null;
}
