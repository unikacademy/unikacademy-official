import { STATUS_LABEL, STATUS_TONE } from "@/modules/dashboard/status";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";

/** Inbox status (not read / read / replied / shortlisted / rejected) */
export function StatusBadge({ status }: { status: string }) {
  return (
    <StatusPill tone={STATUS_TONE[status] ?? "gray"}>
      {STATUS_LABEL[status] ?? status}
    </StatusPill>
  );
}
