import type { PillTone } from "@/modules/dashboard/components/StatusPill";

// Sales follow-up funnel for a demo booking:
//   call -> booking -> conducted -> enrollment
// Each step only unlocks once the previous one is positive. Independent of
// `demoStatus` (the teacher/schedule lifecycle).

export type CallStatus = "not_connected" | "not_picked" | "picked";
export type BookingStatus = "booked" | "not_booked";
export type ConductStatus = "conducted" | "not_conducted";
export type EnrollmentStatus = "enrolled" | "not_enrolled";

export interface DemoFollowup {
  callStatus: CallStatus | null;
  bookingStatus: BookingStatus | null;
  conductStatus: ConductStatus | null;
  enrollmentStatus: EnrollmentStatus | null;
  followupNote: string | null;
}

export type FollowupKey = Exclude<keyof DemoFollowup, "followupNote">;

export const FOLLOWUP_NOTE_MAX = 500;

export interface FollowupOption {
  value: string;
  label: string;
  tone: PillTone;
}

export interface FollowupStep {
  key: FollowupKey;
  label: string;
  /** The option that lets the next step unlock. */
  positive: string;
  options: FollowupOption[];
}

export const FOLLOWUP_STEPS: FollowupStep[] = [
  {
    key: "callStatus",
    label: "Call",
    positive: "picked",
    options: [
      { value: "picked", label: "Picked up", tone: "green" },
      { value: "not_picked", label: "Not picked up", tone: "orange" },
      { value: "not_connected", label: "Not connected", tone: "red" },
    ],
  },
  {
    key: "bookingStatus",
    label: "Demo booking",
    positive: "booked",
    options: [
      { value: "booked", label: "Booked", tone: "green" },
      { value: "not_booked", label: "Not booked", tone: "red" },
    ],
  },
  {
    key: "conductStatus",
    label: "Demo session",
    positive: "conducted",
    options: [
      { value: "conducted", label: "Conducted", tone: "green" },
      { value: "not_conducted", label: "Not conducted", tone: "orange" },
    ],
  },
  {
    key: "enrollmentStatus",
    label: "Enrollment",
    positive: "enrolled",
    options: [
      { value: "enrolled", label: "Enrolled", tone: "green" },
      { value: "not_enrolled", label: "Not enrolled", tone: "red" },
    ],
  },
];

export const EMPTY_FOLLOWUP: DemoFollowup = {
  callStatus: null,
  bookingStatus: null,
  conductStatus: null,
  enrollmentStatus: null,
  followupNote: null,
};

/** Is step `index` unlocked, i.e. is every earlier step positive? */
export function isStepUnlocked(
  followup: Pick<DemoFollowup, FollowupKey>,
  index: number,
) {
  return FOLLOWUP_STEPS.slice(0, index).every(
    (s) => followup[s.key] === s.positive,
  );
}

/** Set one step and clear every later step (they no longer apply). */
export function setFollowupStep(
  followup: DemoFollowup,
  key: FollowupKey,
  value: string | null,
): DemoFollowup {
  const index = FOLLOWUP_STEPS.findIndex((s) => s.key === key);
  const next = { ...followup, [key]: value } as DemoFollowup;
  for (const later of FOLLOWUP_STEPS.slice(index + 1)) {
    (next as unknown as Record<string, unknown>)[later.key] = null;
  }
  return next;
}

/**
 * Check a follow-up from a request body. Returns the cleaned value, or an
 * error message for an unknown option or a step set without its predecessor.
 */
export function parseFollowup(
  body: unknown,
): { value: DemoFollowup } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request" };
  const b = body as Record<string, unknown>;
  const value: DemoFollowup = { ...EMPTY_FOLLOWUP };

  for (const [index, step] of FOLLOWUP_STEPS.entries()) {
    const raw = b[step.key];
    if (raw === null || raw === undefined || raw === "") continue;
    if (!step.options.some((o) => o.value === raw)) {
      return { error: `Invalid ${step.label.toLowerCase()} status` };
    }
    if (!isStepUnlocked(value, index)) {
      return {
        error: `${step.label} can't be set until the earlier steps are positive`,
      };
    }
    (value as unknown as Record<string, unknown>)[step.key] = raw;
  }

  if (b.followupNote !== null && b.followupNote !== undefined) {
    const note = String(b.followupNote).trim();
    if (note.length > FOLLOWUP_NOTE_MAX) {
      return { error: `Note must be ${FOLLOWUP_NOTE_MAX} characters or fewer` };
    }
    value.followupNote = note || null;
  }

  return { value };
}

export interface FollowupStage {
  value: string;
  label: string;
  tone: PillTone;
}

// Every stage a booking can be in, in funnel order (used by the list filter)
export const FOLLOWUP_STAGES: FollowupStage[] = [
  { value: "awaiting_call", label: "Awaiting call", tone: "gray" },
  { value: "not_connected", label: "Not connected", tone: "red" },
  { value: "not_picked", label: "Not picked up", tone: "orange" },
  { value: "picked", label: "Picked up", tone: "blue" },
  { value: "not_booked", label: "Demo not booked", tone: "red" },
  { value: "booked", label: "Demo booked", tone: "indigo" },
  { value: "not_conducted", label: "Demo not conducted", tone: "orange" },
  { value: "conducted", label: "Demo conducted", tone: "blue" },
  { value: "not_enrolled", label: "Not enrolled", tone: "red" },
  { value: "enrolled", label: "Enrolled", tone: "green" },
];

/** The single furthest-reached position in the funnel. */
export function followupStageOf(followup: DemoFollowup): FollowupStage {
  let value = "awaiting_call";
  for (const step of FOLLOWUP_STEPS) {
    const current = followup[step.key];
    if (!current) break;
    value = current;
    if (current !== step.positive) break;
  }
  return FOLLOWUP_STAGES.find((s) => s.value === value) ?? FOLLOWUP_STAGES[0];
}
