"use client";

import { useState } from "react";
import type { DemoBooking } from "@/modules/demo-bookings/types";
import {
  FOLLOWUP_NOTE_MAX,
  FOLLOWUP_STEPS,
  isStepUnlocked,
  setFollowupStep,
  type DemoFollowup,
  type FollowupKey,
} from "@/modules/demo-bookings/followup";
import { FollowupStageBadge } from "@/modules/demo-bookings/components/FollowupStageBadge";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";

const labelClass =
  "block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1";

const pickFollowup = (b: DemoBooking): DemoFollowup => ({
  callStatus: b.callStatus,
  bookingStatus: b.bookingStatus,
  conductStatus: b.conductStatus,
  enrollmentStatus: b.enrollmentStatus,
  followupNote: b.followupNote,
});

/**
 * Call → booking → conducted → enrollment tracker in the booking slide-over.
 * A step unlocks once the previous one is positive; changing a step clears
 * the later ones. Read-only without `canManage`. Mount with key={booking._id}
 * so the form resets when another booking is opened.
 */
export function DemoFollowupTracker({
  booking,
  canManage,
  onSaved,
}: {
  booking: DemoBooking;
  canManage: boolean;
  onSaved: (booking: DemoBooking) => void;
}) {
  const saved = pickFollowup(booking);
  const [draft, setDraft] = useState<DemoFollowup>(saved);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const choose = (key: FollowupKey, value: string) => {
    // Clicking the selected option again clears it
    setDraft((d) => setFollowupStep(d, key, d[key] === value ? null : value));
  };

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/demo-bookings/${booking._id}/followup`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save follow-up");
        return;
      }
      onSaved(data as DemoBooking);
    } catch {
      setError("Failed to save follow-up");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">
          Follow-up
        </p>
        <FollowupStageBadge followup={saved} />
      </div>

      <ol className="space-y-3">
        {FOLLOWUP_STEPS.map((step, index) => {
          const unlocked = isStepUnlocked(draft, index);
          const current = draft[step.key];
          const chosen = step.options.find((o) => o.value === current);
          return (
            <li key={step.key} className="flex gap-3">
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  chosen
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={labelClass}>{step.label}</p>
                {!unlocked ? (
                  <p className="text-xs text-gray-400">
                    Locked until the previous step is positive
                  </p>
                ) : !canManage ? (
                  chosen ? (
                    <StatusPill tone={chosen.tone}>{chosen.label}</StatusPill>
                  ) : (
                    <p className="text-sm text-gray-400">Not recorded</p>
                  )
                ) : (
                  <div
                    role="group"
                    aria-label={step.label}
                    className="flex flex-wrap gap-2"
                  >
                    {step.options.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={current === o.value}
                        onClick={() => choose(step.key, o.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          current === o.value
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-primary/40"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div>
        <label htmlFor="followup-note" className={labelClass}>
          Note
        </label>
        {canManage ? (
          <textarea
            id="followup-note"
            value={draft.followupNote ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, followupNote: e.target.value }))
            }
            maxLength={FOLLOWUP_NOTE_MAX}
            rows={2}
            placeholder="Reason, callback time, anything useful…"
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <p className="text-sm text-gray-800">{booking.followupNote || "—"}</p>
        )}
      </div>

      {canManage && (
        <>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save follow-up"}
          </button>
        </>
      )}
    </div>
  );
}
