import type { ProfileSection } from "@/modules/auth/permissions";

export interface Profile {
  id: string;
  email: string | null; // login email — read-only
  avatarUrl: string | null;
  // basic (everyone)
  fullName: string | null;
  phone: string | null;
  dateOfBirth: string | null; // YYYY-MM-DD
  city: string | null;
  // student section
  college: string | null;
  fieldOfStudy: string | null;
  yearOfStudy: string | null;
  // teacher section
  qualification: string | null;
  experienceYears: number | null;
  specialization: string | null;
  bio: string | null;
}

// Fields a user may edit, grouped by the section that shows them.
// Anything not listed here can't be changed through My Profile.
export const PROFILE_FIELDS = {
  basic: ["fullName", "phone", "dateOfBirth", "city"],
  student: ["college", "fieldOfStudy", "yearOfStudy"],
  teacher: ["qualification", "experienceYears", "specialization", "bio"],
} as const satisfies Record<
  "basic" | ProfileSection,
  readonly (keyof Profile)[]
>;

export type EditableField =
  (typeof PROFILE_FIELDS)[keyof typeof PROFILE_FIELDS][number];

// Form values are all strings (as typed); the server converts them.
export type ProfileFormValues = Record<EditableField, string>;

export const YEAR_OF_STUDY_OPTIONS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year",
  "Graduated",
  "Working professional",
  "Other",
];
