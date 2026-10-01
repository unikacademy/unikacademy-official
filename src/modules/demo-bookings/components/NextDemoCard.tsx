import Link from "next/link";
import type { DemoStage } from "@/modules/demo-bookings/types";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import { formatDateTimeIST } from "@/modules/dashboard/format";

export type NextDemo = {
  scheduledAt: string | null;
  demoStatus: DemoStage;
  course: string;
  meetLink: string | null;
  withLabel: string | null; // "with <student/teacher>"
};

/** Overview card: the soonest upcoming demo, or an empty message. */
export function NextDemoCard({
  title,
  href,
  linkLabel,
  next,
  upcomingCount,
  emptyText,
  emptyAction,
}: {
  title: string;
  href: string;
  linkLabel: string;
  next: NextDemo | null;
  upcomingCount: number;
  emptyText: string;
  emptyAction?: { href: string; label: string };
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {title}
        </h3>
        <Link
          href={href}
          className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
        >
          {linkLabel}
          {upcomingCount > 1 ? ` (${upcomingCount} upcoming)` : ""} →
        </Link>
      </div>

      {next ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900">
                {next.scheduledAt
                  ? formatDateTimeIST(next.scheduledAt)
                  : "Time to be confirmed"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {next.course}
                {next.withLabel ? ` · with ${next.withLabel}` : ""}
              </p>
            </div>
            <DemoStageBadge stage={next.demoStatus} />
          </div>
          {next.meetLink && (
            <a
              href={next.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
            >
              Join Google Meet
            </a>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-500">
          {emptyText}
          {emptyAction && (
            <>
              {" "}
              <Link
                href={emptyAction.href}
                className="text-primary font-semibold hover:underline"
              >
                {emptyAction.label}
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}
