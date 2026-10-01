import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BookingType, DemoStage } from "@/modules/demo-bookings/types";

// What a student may see about their own demo. The select below is the
// whitelist — the teacher's phone and email are deliberately never fetched.
const STUDENT_DEMO_SELECT = [
  "id",
  "course",
  "message",
  "booking_type",
  "scheduled_at",
  "meet_link",
  "demo_status",
  "created_at",
  "teacher:profiles!teacher_id(full_name, avatar_url, qualification, experience_years, specialization, bio)",
].join(", ");

export interface StudentDemoTeacher {
  fullName: string | null;
  avatarUrl: string | null;
  qualification: string | null;
  experienceYears: number | null;
  specialization: string | null;
  bio: string | null;
}

export interface StudentDemo {
  id: string;
  course: string;
  message: string | null;
  bookingType: BookingType;
  scheduledAt: string | null;
  meetLink: string | null;
  demoStatus: DemoStage;
  bookedAt: string;
  teacher: StudentDemoTeacher | null;
}

type Row = {
  id: string;
  course: string;
  message: string | null;
  booking_type: BookingType;
  scheduled_at: string | null;
  meet_link: string | null;
  demo_status: DemoStage;
  created_at: string;
  teacher: {
    full_name: string | null;
    avatar_url: string | null;
    qualification: string | null;
    experience_years: number | null;
    specialization: string | null;
    bio: string | null;
  } | null;
};

/** Demo bookings an admin linked to this student, soonest first. */
export async function listOwnDemos(studentId: string): Promise<StudentDemo[]> {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .select(STUDENT_DEMO_SELECT)
    .eq("student_id", studentId)
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    course: r.course,
    message: r.message,
    bookingType: r.booking_type,
    scheduledAt: r.scheduled_at,
    meetLink: r.meet_link,
    demoStatus: r.demo_status,
    bookedAt: r.created_at,
    teacher: r.teacher && {
      fullName: r.teacher.full_name,
      avatarUrl: r.teacher.avatar_url,
      qualification: r.teacher.qualification,
      experienceYears: r.teacher.experience_years,
      specialization: r.teacher.specialization,
      bio: r.teacher.bio,
    },
  }));
}
