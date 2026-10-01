import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BookingType, DemoStage } from "@/modules/demo-bookings/types";

// What a teacher may see about a demo assigned to them. The select below is
// the whitelist — the student's email is deliberately never fetched.
const TEACHER_DEMO_SELECT = [
  "id",
  "name",
  "phone",
  "course",
  "message",
  "booking_type",
  "company_name",
  "participants",
  "scheduled_at",
  "meet_link",
  "demo_status",
  "student:profiles!student_id(full_name, phone, avatar_url, date_of_birth, city, college, field_of_study, year_of_study)",
].join(", ");

export interface TeacherDemoStudent {
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  city: string | null;
  college: string | null;
  fieldOfStudy: string | null;
  yearOfStudy: string | null;
}

export interface TeacherDemo {
  id: string;
  // As entered on the booking form (used until a student account is linked)
  bookedName: string;
  bookedPhone: string;
  course: string;
  message: string | null;
  bookingType: BookingType;
  companyName: string | null;
  participants: number | null;
  scheduledAt: string | null;
  meetLink: string | null;
  demoStatus: DemoStage;
  student: TeacherDemoStudent | null; // linked account's profile
}

type Row = {
  id: string;
  name: string;
  phone: string;
  course: string;
  message: string | null;
  booking_type: BookingType;
  company_name: string | null;
  participants: number | null;
  scheduled_at: string | null;
  meet_link: string | null;
  demo_status: DemoStage;
  student: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    city: string | null;
    college: string | null;
    field_of_study: string | null;
    year_of_study: string | null;
  } | null;
};

/** Demos assigned to this teacher, soonest first (unscheduled last). */
export async function listAssignedDemos(
  teacherId: string,
): Promise<TeacherDemo[]> {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .select(TEACHER_DEMO_SELECT)
    .eq("teacher_id", teacherId)
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    bookedName: r.name,
    bookedPhone: r.phone,
    course: r.course,
    message: r.message,
    bookingType: r.booking_type,
    companyName: r.company_name,
    participants: r.participants,
    scheduledAt: r.scheduled_at,
    meetLink: r.meet_link,
    demoStatus: r.demo_status,
    student: r.student && {
      fullName: r.student.full_name,
      phone: r.student.phone,
      avatarUrl: r.student.avatar_url,
      dateOfBirth: r.student.date_of_birth,
      city: r.student.city,
      college: r.student.college,
      fieldOfStudy: r.student.field_of_study,
      yearOfStudy: r.student.year_of_study,
    },
  }));
}
