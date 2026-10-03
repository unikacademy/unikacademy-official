import type { ContactStatus } from "@/modules/contacts/types";
import type { PillTone } from "@/modules/dashboard/components/StatusPill";

export type BookingType = "individual" | "corporate";

// Demo lifecycle — separate from the inbox `status` (not_read/read/replied)
export type DemoStage =
  | "pending"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export const DEMO_STAGES: {
  value: DemoStage;
  label: string;
  tone: PillTone;
}[] = [
  { value: "pending", label: "Pending", tone: "gray" },
  { value: "scheduled", label: "Scheduled", tone: "blue" },
  { value: "rescheduled", label: "Rescheduled", tone: "indigo" },
  { value: "completed", label: "Completed", tone: "green" },
  { value: "no_show", label: "No-show", tone: "orange" },
  { value: "cancelled", label: "Cancelled", tone: "red" },
];

// Stages that only make sense once a teacher and time are set
export const STAGES_NEEDING_SCHEDULE: DemoStage[] = [
  "scheduled",
  "rescheduled",
  "completed",
  "no_show",
];

export const MEET_LINK_RE =
  /^https:\/\/meet\.google\.com\/[A-Za-z0-9-]+(\?.*)?$/;

export interface PersonRef {
  id: string;
  fullName: string | null;
  email: string | null;
}

export interface DemoBooking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  status: ContactStatus;
  bookingType: BookingType;
  companyName?: string;
  companySize?: string;
  participants?: number;
  preferredDate?: string;
  createdAt: string;
  // assignment (phase 3)
  demoStatus: DemoStage;
  scheduledAt: string | null;
  meetLink: string | null;
  studentId: string | null;
  teacherId: string | null;
  student: PersonRef | null;
  teacher: PersonRef | null;
}

// Body of PATCH /api/admin/demo-bookings/[id]/assign
export interface DemoAssignment {
  studentId: string | null;
  teacherId: string | null;
  scheduledAt: string | null; // ISO 8601
  meetLink: string | null;
  demoStatus: DemoStage;
}

// Accounts the admin can pick from
export interface Assignees {
  teachers: PersonRef[];
  students: PersonRef[];
}
