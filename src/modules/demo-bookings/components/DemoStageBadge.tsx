import { DEMO_STAGES, type DemoStage } from "@/modules/demo-bookings/types";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";

export function DemoStageBadge({ stage }: { stage: DemoStage }) {
  const s = DEMO_STAGES.find((x) => x.value === stage) ?? DEMO_STAGES[0];
  return <StatusPill tone={s.tone}>{s.label}</StatusPill>;
}
