import type { BookingType } from "@/modules/demo-bookings/types";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";

export function BookingTypeBadge({ type }: { type?: BookingType }) {
  return type === "corporate" ? (
    <StatusPill tone="yellow">Corporate</StatusPill>
  ) : (
    <StatusPill tone="gray">Individual</StatusPill>
  );
}
