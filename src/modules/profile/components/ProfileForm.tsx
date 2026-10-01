"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileSection } from "@/modules/auth/permissions";
import {
  YEAR_OF_STUDY_OPTIONS,
  type EditableField,
  type Profile,
  type ProfileFormValues,
} from "@/modules/profile/types";
import { editableFields, validateProfile } from "@/modules/profile/validation";
import { AvatarUploader } from "@/modules/profile/components/AvatarUploader";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";

type Errors = Partial<Record<EditableField, string>>;

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition bg-white";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function toFormValues(p: Profile): ProfileFormValues {
  const s = (v: string | number | null) => (v === null ? "" : String(v));
  return {
    fullName: s(p.fullName),
    phone: s(p.phone),
    dateOfBirth: s(p.dateOfBirth),
    city: s(p.city),
    college: s(p.college),
    fieldOfStudy: s(p.fieldOfStudy),
    yearOfStudy: s(p.yearOfStudy),
    qualification: s(p.qualification),
    experienceYears: s(p.experienceYears),
    specialization: s(p.specialization),
    bio: s(p.bio),
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </section>
  );
}

export function ProfileForm({
  profile,
  sections,
  loginAvatarUrl,
}: {
  profile: Profile;
  sections: ProfileSection[];
  loginAvatarUrl: string | null;
}) {
  const router = useRouter();
  const { toasts, showToast } = useToasts();
  const [values, setValues] = useState<ProfileFormValues>(() =>
    toFormValues(profile),
  );
  const [saved, setSaved] = useState<ProfileFormValues>(() =>
    toFormValues(profile),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const fields = editableFields(sections);
  const dirty = fields.some((f) => values[f] !== saved[f]);
  const today = new Date().toISOString().slice(0, 10);

  const set = (field: EditableField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrors = validateProfile(values, sections);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      showToast("Please fix the highlighted fields", "error");
      return;
    }

    setSaving(true);
    try {
      const body = Object.fromEntries(fields.map((f) => [f, values[f]]));
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        showToast(data.error ?? "Failed to save profile", "error");
        return;
      }
      const next = toFormValues(data as Profile);
      setValues(next);
      setSaved(next);
      showToast("Profile saved");
      router.refresh(); // update name in the sidebar / top bar
    } catch {
      showToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url);
    showToast(
      url && url !== loginAvatarUrl ? "Photo updated" : "Photo removed",
    );
    router.refresh();
  };

  // Renders one text-like input with its label and error
  const field = (
    name: EditableField,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        value={values[name]}
        onChange={(e) => set(name, e.target.value)}
        aria-invalid={!!errors[name]}
        className={`${inputClass} ${errors[name] ? "border-red-300" : "border-gray-200"}`}
        {...props}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  const name = values.fullName || profile.email || "?";

  return (
    <>
      <ToastContainer toasts={toasts} />

      <form onSubmit={save} className="space-y-6 max-w-3xl">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-5">
            Photo
          </h3>
          <AvatarUploader
            userId={profile.id}
            name={name}
            avatarUrl={avatarUrl}
            canRemove={!!avatarUrl && avatarUrl !== loginAvatarUrl}
            onChange={handleAvatarChange}
            onError={(m) => showToast(m, "error")}
          />
        </section>

        <Section title="Basic details">
          {field("fullName", "Full name *", {
            autoComplete: "name",
            maxLength: 60,
          })}
          <div>
            <label className={labelClass}>Email</label>
            <input
              value={profile.email ?? ""}
              readOnly
              className={`${inputClass} border-gray-200 bg-gray-50 text-gray-500`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Your login email — can&apos;t be changed here
            </p>
          </div>
          {field("phone", "Phone", {
            type: "tel",
            inputMode: "numeric",
            autoComplete: "tel-national",
            placeholder: "10-digit mobile number",
            maxLength: 15,
          })}
          {field("dateOfBirth", "Date of birth", {
            type: "date",
            max: today,
            min: "1900-01-01",
          })}
          {field("city", "City", {
            autoComplete: "address-level2",
            maxLength: 100,
          })}
        </Section>

        {sections.includes("student") && (
          <Section
            title="Education"
            description="Helps your teacher prepare for your demo"
          >
            {field("college", "College / school", { maxLength: 150 })}
            {field("fieldOfStudy", "Field of study", {
              placeholder: "e.g. B.Com, Engineering",
              maxLength: 100,
            })}
            <div>
              <label htmlFor="yearOfStudy" className={labelClass}>
                Year of study
              </label>
              <select
                id="yearOfStudy"
                value={values.yearOfStudy}
                onChange={(e) => set("yearOfStudy", e.target.value)}
                className={`${inputClass} ${errors.yearOfStudy ? "border-red-300" : "border-gray-200"}`}
              >
                <option value="">Select…</option>
                {YEAR_OF_STUDY_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {errors.yearOfStudy && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.yearOfStudy}
                </p>
              )}
            </div>
          </Section>
        )}

        {sections.includes("teacher") && (
          <Section
            title="Teaching"
            description="Shown to students on their demo page"
          >
            {field("qualification", "Qualification", {
              placeholder: "e.g. M.A. English, CELTA",
              maxLength: 150,
            })}
            {field("experienceYears", "Years of experience", {
              type: "number",
              min: 0,
              max: 80,
              inputMode: "numeric",
            })}
            {field("specialization", "Specialization", {
              placeholder: "e.g. Public speaking, IELTS",
              maxLength: 150,
            })}
            <div className="sm:col-span-2">
              <label htmlFor="bio" className={labelClass}>
                Short bio
              </label>
              <textarea
                id="bio"
                rows={4}
                maxLength={500}
                value={values.bio}
                onChange={(e) => set("bio", e.target.value)}
                className={`${inputClass} resize-none ${errors.bio ? "border-red-300" : "border-gray-200"}`}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-red-600">{errors.bio}</span>
                <span className="text-gray-400">{values.bio.length}/500</span>
              </div>
            </div>
          </Section>
        )}

        <div className="flex items-center justify-end gap-3">
          {dirty && (
            <span className="text-xs text-gray-500">
              You have unsaved changes
            </span>
          )}
          <button
            type="submit"
            disabled={saving || !dirty}
            className="px-6 py-2.5 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </>
  );
}
