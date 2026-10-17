import {
  followupStageOf,
  type DemoFollowup,
} from "@/modules/demo-bookings/followup";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";

export function FollowupStageBadge({ followup }: { followup: DemoFollowup }) {
  const stage = followupStageOf(followup);
  return <StatusPill tone={stage.tone}>{stage.label}</StatusPill>;
}
