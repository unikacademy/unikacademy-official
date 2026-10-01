// Shared by the My Profile form (instant feedback) and the server (the real
// check). Pure functions only — safe to import on both sides.
import { validateName, validatePhone } from "@/shared/validation";
import type { ProfileSection } from "@/modules/auth/permissions";
import {
  PROFILE_FIELDS,
  YEAR_OF_STUDY_OPTIONS,
  type EditableField,
  type ProfileFormValues,
} from "@/modules/profile/types";

const MAX_LENGTH: Partial<Record<EditableField, number>> = {
  city: 100,
  college: 150,
  fieldOfStudy: 100,
  qualification: 150,
  specialization: 150,
  bio: 500,
};

/** Fields the user may edit, given their profile sections. */
export function editableFields(sections: ProfileSection[]): EditableField[] {
  return [
    ...PROFILE_FIELDS.basic,
    ...sections.flatMap((s) => PROFILE_FIELDS[s]),
  ];
}

function validateField(field: EditableField, raw: string): string | null {
  const value = raw.trim();

  if (field === "fullName") return validateName(value);
  if (!value) return null; // every other field is optional

  if (field === "phone") return validatePhone(value);

  if (field === "dateOfBirth") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date.";
    const dob = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(dob.getTime())) return "Enter a valid date.";
    if (dob > new Date()) return "Date of birth can't be in the future.";
    if (dob.getUTCFullYear() < 1900) return "Enter a valid date of birth.";
    return null;
  }

  if (field === "experienceYears") {
    if (!/^\d+$/.test(value)) return "Enter a whole number of years.";
    const years = Number(value);
    if (years > 80) return "Experience must be 80 years or less.";
    return null;
  }

  if (field === "yearOfStudy" && !YEAR_OF_STUDY_OPTIONS.includes(value)) {
    return "Choose an option from the list.";
  }

  const max = MAX_LENGTH[field];
  if (max && value.length > max) return `Must be ${max} characters or fewer.`;
  return null;
}

/** Validates the fields the user may edit. Returns { field: message }. */
export function validateProfile(
  values: Partial<ProfileFormValues>,
  sections: ProfileSection[],
): Partial<Record<EditableField, string>> {
  const errors: Partial<Record<EditableField, string>> = {};
  for (const field of editableFields(sections)) {
    const message = validateField(field, values[field] ?? "");
    if (message) errors[field] = message;
  }
  return errors;
}
