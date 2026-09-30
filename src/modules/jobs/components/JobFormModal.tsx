"use client";

import { useState } from "react";
import { JOB_TYPES, JOB_WORKMODES, type Job } from "@/modules/jobs/types";
import { BulletListInput } from "@/modules/dashboard/components/BulletListInput";

const EMPTY_JOB_FORM = {
  title: "",
  type: "Internship",
  workMode: "Work From Home",
  responsibilities: [""],
  eligibility: [""],
  isActive: true,
};

type JobForm = typeof EMPTY_JOB_FORM;

function formFromJob(job: Job): JobForm {
  return {
    title: job.title,
    type: job.type,
    workMode: job.workMode,
    responsibilities: job.responsibilities.length ? job.responsibilities : [""],
    eligibility: job.eligibility.length ? job.eligibility : [""],
    isActive: job.isActive,
  };
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

/**
 * Create (job = null) or edit a job posting. Mounted only while open, so the
 * form starts fresh from `job` each time.
 */
export function JobFormModal({
  job,
  onClose,
  onSaved,
  onError,
}: {
  job: Job | null;
  onClose: () => void;
  onSaved: (saved: Job, created: boolean) => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<JobForm>(() =>
    job ? formFromJob(job) : EMPTY_JOB_FORM,
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title.trim()) {
      onError("Job title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.filter((r) => r.trim()),
        eligibility: form.eligibility.filter((e) => e.trim()),
      };
      const res = await fetch(
        job ? `/api/admin/jobs/${job._id}` : "/api/admin/jobs",
        {
          method: job ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        onSaved((await res.json()) as Job, !job);
      } else {
        onError("Failed to save job");
      }
    } catch {
      onError("Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold text-primary">
            {job ? "Edit Job Posting" : "Create Job Posting"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className={labelClass}>Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Sales Executive"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Type *</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className={`${inputClass} bg-white`}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Work Mode *</label>
              <select
                value={form.workMode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, workMode: e.target.value }))
                }
                className={`${inputClass} bg-white`}
              >
                {JOB_WORKMODES.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <BulletListInput
            label="Responsibilities"
            items={form.responsibilities}
            onChange={(responsibilities) =>
              setForm((f) => ({ ...f, responsibilities }))
            }
            placeholder="Responsibility"
            addLabel="Add Responsibility"
          />

          <BulletListInput
            label="Eligibility"
            items={form.eligibility}
            onChange={(eligibility) => setForm((f) => ({ ...f, eligibility }))}
            placeholder="Eligibility"
            addLabel="Add Eligibility"
          />

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Publish to website
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                When active, this job appears on the Careers page
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.isActive}
              aria-label="Publish to website"
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && (
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {job ? "Save Changes" : "Create Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
