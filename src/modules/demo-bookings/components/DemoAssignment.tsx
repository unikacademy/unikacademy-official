"use client";

import { useState } from "react";
import {
  DEMO_STAGES,
  MEET_LINK_RE,
  STAGES_NEEDING_SCHEDULE,
  type Assignees,
  type DemoBooking,
  type DemoStage,
  type PersonRef,
} from "@/modules/demo-bookings/types";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import {
  formatDateTimeIST,
  fromISTInputValue,
  toISTInputValue,
} from "@/modules/dashboard/format";

const labelClass =
  "block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1";
const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition";

const personLabel = (p: PersonRef) =>
  p.fullName
    ? `${p.fullName}${p.email ? ` (${p.email})` : ""}`
    : (p.email ?? p.id);

// Keep the currently linked person selectable even if they lost the role
function withCurrent(list: PersonRef[], current: PersonRef | null) {
  return current && !list.some((p) => p.id === current.id)
    ? [current, ...list]
    : list;
}

function Summary({ booking }: { booking: DemoBooking }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className={labelClass}>Stage</p>
        <DemoStageBadge stage={booking.demoStatus} />
      </div>
      <div>
        <p className={labelClass}>Scheduled</p>
        <p className="text-sm text-gray-800">
          {booking.scheduledAt ? formatDateTimeIST(booking.scheduledAt) : "—"}
        </p>
      </div>
      <div>
        <p className={labelClass}>Teacher</p>
        <p className="text-sm text-gray-800">
          {booking.teacher ? personLabel(booking.teacher) : "—"}
        </p>
      </div>
      <div>
        <p className={labelClass}>Student account</p>
        <p className="text-sm text-gray-800">
          {booking.student ? personLabel(booking.student) : "Not linked"}
        </p>
      </div>
      {booking.meetLink && (
        <div className="col-span-2">
          <p className={labelClass}>Google Meet</p>
          <a
            href={booking.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline break-all"
          >
            {booking.meetLink}
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Demo assignment inside the booking slide-over. Read-only summary without
 * `canAssign`; an edit form with it. Mount with key={booking._id} so the form
 * resets when another booking is opened.
 */
export function DemoAssignment({
  booking,
  canAssign,
  assignees,
  onSaved,
}: {
  booking: DemoBooking;
  canAssign: boolean;
  assignees: Assignees | null; // null while loading
  onSaved: (booking: DemoBooking) => void;
}) {
  const [studentId, setStudentId] = useState(booking.studentId ?? "");
  const [teacherId, setTeacherId] = useState(booking.teacherId ?? "");
  const [when, setWhen] = useState(toISTInputValue(booking.scheduledAt));
  const [meetLink, setMeetLink] = useState(booking.meetLink ?? "");
  const [stage, setStage] = useState<DemoStage>(booking.demoStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    studentId !== (booking.studentId ?? "") ||
    teacherId !== (booking.teacherId ?? "") ||
    when !== toISTInputValue(booking.scheduledAt) ||
    meetLink !== (booking.meetLink ?? "") ||
    stage !== booking.demoStatus;

  // Picking a teacher + time on a pending demo moves it to "scheduled"
  const autoSchedule = (nextTeacher: string, nextWhen: string) => {
    if (stage === "pending" && nextTeacher && nextWhen) setStage("scheduled");
  };

  const save = async () => {
    setError(null);
    const link = meetLink.trim();
    if (link && !MEET_LINK_RE.test(link)) {
      setError("Meet link must look like https://meet.google.com/abc-defg-hij");
      return;
    }
    if (STAGES_NEEDING_SCHEDULE.includes(stage) && (!teacherId || !when)) {
      setError("Assign a teacher and a date/time before setting this stage");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/demo-bookings/${booking._id}/assign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: studentId || null,
            teacherId: teacherId || null,
            scheduledAt: fromISTInputValue(when),
            meetLink: link || null,
            demoStatus: stage,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save assignment");
        return;
      }
      onSaved(data as DemoBooking);
    } catch {
      setError("Failed to save assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">
          Demo assignment
        </p>
        <DemoStageBadge stage={booking.demoStatus} />
      </div>

      {!canAssign ? (
        <Summary booking={booking} />
      ) : !assignees ? (
        <p className="text-sm text-gray-400">Loading teachers and students…</p>
      ) : (
        <>
          <div>
            <label htmlFor="assign-student" className={labelClass}>
              Student account
            </label>
            <select
              id="assign-student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className={inputClass}
            >
              <option value="">— Not linked —</option>
              {withCurrent(assignees.students, booking.student).map((p) => (
                <option key={p.id} value={p.id}>
                  {personLabel(p)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Lets the student see this demo on their dashboard. Booked as{" "}
              <span className="font-medium text-gray-600">
                {booking.name}
                {booking.email ? ` · ${booking.email}` : ""}
              </span>
            </p>
          </div>

          <div>
            <label htmlFor="assign-teacher" className={labelClass}>
              Teacher
            </label>
            <select
              id="assign-teacher"
              value={teacherId}
              onChange={(e) => {
                setTeacherId(e.target.value);
                autoSchedule(e.target.value, when);
              }}
              className={inputClass}
            >
              <option value="">— Not assigned —</option>
              {withCurrent(assignees.teachers, booking.teacher).map((p) => (
                <option key={p.id} value={p.id}>
                  {personLabel(p)}
                </option>
              ))}
            </select>
            {assignees.teachers.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-600">
                No teacher accounts yet — give someone the teacher role on Users
                &amp; Roles.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="assign-when" className={labelClass}>
                Date &amp; time (IST)
              </label>
              <input
                id="assign-when"
                type="datetime-local"
                value={when}
                onChange={(e) => {
                  setWhen(e.target.value);
                  autoSchedule(teacherId, e.target.value);
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="assign-stage" className={labelClass}>
                Stage
              </label>
              <select
                id="assign-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as DemoStage)}
                className={inputClass}
              >
                {DEMO_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assign-meet" className={labelClass}>
              Google Meet link
            </label>
            <input
              id="assign-meet"
              type="url"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save assignment"}
          </button>
        </>
      )}
    </div>
  );
}
