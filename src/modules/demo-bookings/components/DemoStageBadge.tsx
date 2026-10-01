import { DEMO_STAGES, type DemoStage } from "@/modules/demo-bookings/types";

export function DemoStageBadge({ stage }: { stage: DemoStage }) {
  const s = DEMO_STAGES.find((x) => x.value === stage) ?? DEMO_STAGES[0];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${s.className}`}
    >
      {s.label}
    </span>
  );
}
