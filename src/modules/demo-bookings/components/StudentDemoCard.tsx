import type { StudentDemo } from "@/modules/demo-bookings/server/student";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import { formatDate, formatDateTimeIST } from "@/modules/dashboard/format";

// Friendly line under the time, per stage
const STAGE_NOTE: Partial<Record<StudentDemo["demoStatus"], string>> = {
  pending: "We'll confirm your demo time soon.",
  rescheduled: "Your demo has a new time — see above.",
  cancelled: "This demo was cancelled. Book again any time.",
  no_show: "We missed you at this demo. Book again any time.",
  completed: "Thanks for attending your demo!",
};

/** One of the student's demo bookings (no teacher phone/email). */
export function StudentDemoCard({
  demo,
  upcoming,
}: {
  demo: StudentDemo;
  upcoming: boolean;
}) {
  const t = demo.teacher;
  const note = STAGE_NOTE[demo.demoStatus];

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-primary">
            {demo.scheduledAt
              ? formatDateTimeIST(demo.scheduledAt)
              : "Time to be confirmed"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {demo.course}
            </span>
            <span className="text-xs text-gray-400">
              Booked {formatDate(demo.bookedAt)}
            </span>
          </div>
        </div>
        <DemoStageBadge stage={demo.demoStatus} />
      </div>

      {note && <p className="text-sm text-gray-500">{note}</p>}

      {upcoming && demo.meetLink && (
        <a
          href={demo.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Join Google Meet
        </a>
      )}

      {/* Teacher */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Your teacher
        </p>
        {t ? (
          <>
            <div className="flex items-center gap-3">
              {t.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatarUrl}
                  alt={t.fullName ?? "Teacher"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">
                    {(t.fullName ?? "T")[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {t.fullName ?? "Your teacher"}
                </p>
                {t.qualification && (
                  <p className="text-sm text-gray-500 truncate">
                    {t.qualification}
                  </p>
                )}
              </div>
            </div>
            {(t.experienceYears !== null || t.specialization) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.experienceYears !== null && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600">
                    {t.experienceYears} yr{t.experienceYears !== 1 ? "s" : ""}{" "}
                    experience
                  </span>
                )}
                {t.specialization && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-[#8a742f]">
                    {t.specialization}
                  </span>
                )}
              </div>
            )}
            {t.bio && (
              <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                {t.bio}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            A teacher will be assigned to your demo soon.
          </p>
        )}
      </div>
    </article>
  );
}
