import { supabaseAdmin, toRecord } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";
import {
  DEMO_STAGES,
  MEET_LINK_RE,
  STAGES_NEEDING_SCHEDULE,
  type DemoStage,
  type PersonRef,
} from "@/modules/demo-bookings/types";

// Booking + the linked student and assigned teacher (two FKs to profiles,
// so each embed names its column)
const BOOKING_SELECT =
  "*, student:profiles!student_id(id, full_name, email), teacher:profiles!teacher_id(id, full_name, email)";

type ProfileRef = {
  id: string;
  full_name: string | null;
  email: string | null;
} | null;

function toPerson(p: ProfileRef): PersonRef | null {
  return p ? { id: p.id, fullName: p.full_name, email: p.email } : null;
}

function toBooking(row: Record<string, unknown>) {
  const record = toRecord(row);
  record.student = toPerson(row.student as ProfileRef);
  record.teacher = toPerson(row.teacher as ProfileRef);
  return record;
}

export async function getAllDemoBookings() {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .select(BOOKING_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ok((data ?? []).map(toBooking));
}

export async function updateDemoBookingStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return err("Demo booking not found", 404);
  return ok(toRecord(data));
}

export async function deleteDemoBooking(id: string) {
  const { error, count } = await supabaseAdmin
    .from("demo_bookings")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error || count === 0) return err("Demo booking not found", 404);
  return ok({ message: "Demo booking deleted" });
}

// ── Assignment ──────────────────────────────────────────────────────────────

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Accounts with the teacher / student role, for the admin's pickers. */
export async function listAssignees() {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role_id, profile:profiles!user_id(id, full_name, email)")
    .in("role_id", ["teacher", "student"]);
  if (error) throw error;

  const byRole = (role: string) =>
    (data ?? [])
      .filter((r) => r.role_id === role)
      .map((r) => toPerson(r.profile as unknown as ProfileRef))
      .filter((p): p is PersonRef => p !== null)
      .sort((a, b) =>
        (a.fullName ?? a.email ?? "").localeCompare(
          b.fullName ?? b.email ?? "",
        ),
      );

  return ok({ teachers: byRole("teacher"), students: byRole("student") });
}

async function hasRole(userId: string, role: string) {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("user_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role_id", role);
  if (error) throw error;
  return (count ?? 0) > 0;
}

/**
 * Set a booking's student link, teacher, time, Meet link and demo stage.
 * The whole assignment is replaced (null clears a field).
 */
export async function assignDemo(id: string, body: unknown) {
  if (!UUID_RE.test(id)) return err("Demo booking not found", 404);
  if (!body || typeof body !== "object") return err("Invalid request", 400);
  const b = body as Record<string, unknown>;

  const optionalId = (v: unknown) =>
    v === null || v === undefined || v === "" ? null : String(v);
  const studentId = optionalId(b.studentId);
  const teacherId = optionalId(b.teacherId);

  const stage = b.demoStatus as DemoStage;
  if (!DEMO_STAGES.some((s) => s.value === stage)) {
    return err("Choose a valid demo stage", 400);
  }

  let scheduledAt: string | null = null;
  if (b.scheduledAt) {
    const date = new Date(String(b.scheduledAt));
    if (Number.isNaN(date.getTime())) return err("Invalid date and time", 400);
    scheduledAt = date.toISOString();
  }

  const meetLink = b.meetLink ? String(b.meetLink).trim() : null;
  if (meetLink && !MEET_LINK_RE.test(meetLink)) {
    return err(
      "Meet link must look like https://meet.google.com/abc-defg-hij",
      400,
    );
  }

  if (STAGES_NEEDING_SCHEDULE.includes(stage) && (!teacherId || !scheduledAt)) {
    return err(
      "Assign a teacher and a date/time before setting this stage",
      400,
    );
  }

  if (
    studentId &&
    (!UUID_RE.test(studentId) || !(await hasRole(studentId, "student")))
  ) {
    return err("Selected student account doesn't have the student role", 400);
  }
  if (
    teacherId &&
    (!UUID_RE.test(teacherId) || !(await hasRole(teacherId, "teacher")))
  ) {
    return err("Selected teacher doesn't have the teacher role", 400);
  }

  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .update({
      student_id: studentId,
      teacher_id: teacherId,
      scheduled_at: scheduledAt,
      meet_link: meetLink,
      demo_status: stage,
    })
    .eq("id", id)
    .select(BOOKING_SELECT)
    .single();

  if (error || !data) return err("Demo booking not found", 404);
  return ok(toBooking(data));
}
