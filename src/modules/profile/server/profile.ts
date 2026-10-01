import { NextResponse } from "next/server";
import { ok, err } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { profileSectionsFor } from "@/modules/auth/permissions";
import type { SessionUser } from "@/modules/auth/server/session";
import type {
  EditableField,
  Profile,
  ProfileFormValues,
} from "@/modules/profile/types";
import { editableFields, validateProfile } from "@/modules/profile/validation";

const AVATAR_BUCKET = "avatars";

// camelCase field → profiles column. Only these can ever be written.
const COLUMNS: Record<EditableField, string> = {
  fullName: "full_name",
  phone: "phone",
  dateOfBirth: "date_of_birth",
  city: "city",
  college: "college",
  fieldOfStudy: "field_of_study",
  yearOfStudy: "year_of_study",
  qualification: "qualification",
  experienceYears: "experience_years",
  specialization: "specialization",
  bio: "bio",
};

const PROFILE_SELECT =
  "id, email, avatar_url, full_name, phone, date_of_birth, city, college, field_of_study, year_of_study, qualification, experience_years, specialization, bio";

type ProfileRow = {
  id: string;
  email: string | null;
  avatar_url: string | null;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  city: string | null;
  college: string | null;
  field_of_study: string | null;
  year_of_study: string | null;
  qualification: string | null;
  experience_years: number | null;
  specialization: string | null;
  bio: string | null;
};

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    avatarUrl: row.avatar_url,
    fullName: row.full_name,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    city: row.city,
    college: row.college,
    fieldOfStudy: row.field_of_study,
    yearOfStudy: row.year_of_study,
    qualification: row.qualification,
    experienceYears: row.experience_years,
    specialization: row.specialization,
    bio: row.bio,
  };
}

/** The user's own profile, for the My Profile page. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toProfile(data as ProfileRow) : null;
}

// Form string → column value. Empty becomes null.
function toColumnValue(field: EditableField, raw: string) {
  const value = raw.trim();
  if (!value) return null;
  if (field === "phone") return value.replace(/[\s\-().+]/g, "");
  if (field === "experienceYears") return Number(value);
  return value;
}

/**
 * Update the caller's own profile. Only fields for the caller's profile
 * sections are written; anything else in the body is ignored.
 */
export async function updateProfile(user: SessionUser, body: unknown) {
  if (!body || typeof body !== "object") return err("Invalid request", 400);
  const input = body as Partial<Record<EditableField, unknown>>;

  const sections = profileSectionsFor(user);
  const fields = editableFields(sections);

  const values: Partial<ProfileFormValues> = {};
  for (const field of fields) {
    const v = input[field];
    values[field] = v === null || v === undefined ? "" : String(v);
  }

  const fieldErrors = validateProfile(values, sections);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields", fieldErrors },
      { status: 400 },
    );
  }

  const update: Record<string, unknown> = {};
  for (const field of fields) {
    update[COLUMNS[field]] = toColumnValue(field, values[field] ?? "");
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(update)
    .eq("id", user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error || !data) return err("Profile not found", 404);
  return ok(toProfile(data as ProfileRow));
}

// ── Photo ───────────────────────────────────────────────────────────────────

function ownFolderUrl(userId: string) {
  return supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(`${userId}/`)
    .data.publicUrl;
}

// Deletes a previous uploaded photo — only if it lives in this user's folder
// of our bucket (never touches Google/GitHub URLs or other users' files).
async function deleteOwnUpload(userId: string, url: string | null) {
  const prefix = ownFolderUrl(userId);
  if (!url || !url.startsWith(prefix)) return;
  const path = `${userId}/${url.slice(prefix.length)}`;
  const { error } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .remove([path]);
  if (error) console.error("Failed to delete old avatar:", error);
}

async function currentAvatarUrl(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return (data?.avatar_url as string | null) ?? null;
}

/**
 * Point the caller's profile at a photo they already uploaded (from the
 * browser) to avatars/<their id>/<file>. Validates the path is theirs and the
 * file exists, then deletes their previous upload.
 */
export async function setAvatar(user: SessionUser, path: unknown) {
  const fileRe = new RegExp(
    `^${user.id}/([A-Za-z0-9-]+\\.(?:jpg|jpeg|png|webp))$`,
  );
  const match = typeof path === "string" ? path.match(fileRe) : null;
  if (!match) return err("Invalid photo path", 400);

  const { data: files, error: listError } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .list(user.id, { search: match[1] });
  if (listError) throw listError;
  if (!files?.some((f) => f.name === match[1])) {
    return err("Uploaded photo not found", 400);
  }

  const previous = await currentAvatarUrl(user.id);
  const avatarUrl = supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path as string).data.publicUrl;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);
  if (error) throw error;

  if (previous !== avatarUrl) await deleteOwnUpload(user.id, previous);
  return ok({ avatarUrl });
}

/** Remove the uploaded photo and go back to the Google/GitHub picture. */
export async function removeAvatar(user: SessionUser) {
  const previous = await currentAvatarUrl(user.id);
  const avatarUrl = user.loginAvatarUrl;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);
  if (error) throw error;

  await deleteOwnUpload(user.id, previous);
  return ok({ avatarUrl });
}
