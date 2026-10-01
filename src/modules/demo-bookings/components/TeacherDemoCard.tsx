import type { TeacherDemo } from "@/modules/demo-bookings/server/teacher";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import { BookingTypeBadge } from "@/modules/demo-bookings/components/BookingTypeBadge";
import { ageFrom } from "@/modules/demo-bookings/schedule";
import { formatDateTimeIST } from "@/modules/dashboard/format";

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

/** One assigned demo, as the teacher sees it (no student email). */
export function TeacherDemoCard({
  demo,
  upcoming,
}: {
  demo: TeacherDemo;
  upcoming: boolean;
}) {
  const s = demo.student;
  const name = s?.fullName || demo.bookedName;
  const phone = s?.phone || demo.bookedPhone;
  const age = ageFrom(s?.dateOfBirth ?? null);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      {/* When */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-primary">
            {demo.scheduledAt
              ? formatDateTimeIST(demo.scheduledAt)
              : "Time not set yet"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {demo.course}
            </span>
            {demo.bookingType === "corporate" && (
              <BookingTypeBadge type="corporate" />
            )}
          </div>
        </div>
        <DemoStageBadge stage={demo.demoStatus} />
      </div>

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
      {upcoming && !demo.meetLink && (
        <p className="text-xs text-amber-600">
          Meet link not added yet — the admin will share it.
        </p>
      )}

      {/* Student */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          {s?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.avatarUrl}
              alt={name}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">
                {name[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="text-sm text-gray-600 hover:text-accent transition"
              >
                {phone}
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Detail label="Age" value={age} />
          <Detail label="City" value={s?.city} />
          <Detail label="College" value={s?.college} />
          <Detail label="Field of study" value={s?.fieldOfStudy} />
          <Detail label="Year" value={s?.yearOfStudy} />
          {demo.bookingType === "corporate" && (
            <>
              <Detail label="Company" value={demo.companyName} />
              <Detail label="Participants" value={demo.participants} />
            </>
          )}
        </div>
        {!s && (
          <p className="mt-3 text-xs text-gray-400">
            Details from the booking form — the student hasn&apos;t been linked
            to an account yet.
          </p>
        )}
      </div>

      {demo.message && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Student&apos;s message
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {demo.message}
          </p>
        </div>
      )}
    </article>
  );
}
