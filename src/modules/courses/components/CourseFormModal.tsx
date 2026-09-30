"use client";

import { useState } from "react";
import {
  COURSE_CATEGORIES,
  ICON_OPTIONS,
  type Course,
} from "@/modules/courses/types";
import { BulletListInput } from "@/modules/dashboard/components/BulletListInput";

const EMPTY_COURSE_FORM = {
  title: "",
  description: "",
  category: "core" as Course["category"],
  iconKey: "default",
  price: "",
  features: [""],
  featured: false,
  order: 0,
  isActive: true,
};

type CourseForm = typeof EMPTY_COURSE_FORM;

function formFromCourse(course: Course): CourseForm {
  return {
    title: course.title,
    description: course.description,
    category: course.category,
    iconKey: course.iconKey,
    price: course.price,
    features: course.features.length ? course.features : [""],
    featured: course.featured,
    order: course.order,
    isActive: course.isActive,
  };
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function Toggle({
  checked,
  onChange,
  label,
  onClass,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  onClass: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? onClass : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

/**
 * Create (course = null) or edit a course. Mounted only while open, so the
 * form starts fresh from `course` each time. Price is saved as typed — the
 * website applies charm pricing / MRP when displaying it.
 */
export function CourseFormModal({
  course,
  onClose,
  onSaved,
  onError,
}: {
  course: Course | null;
  onClose: () => void;
  onSaved: (saved: Course, created: boolean) => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<CourseForm>(() =>
    course ? formFromCourse(course) : EMPTY_COURSE_FORM,
  );
  const [saving, setSaving] = useState(false);

  const showPricing =
    form.category === "pricing" || form.category === "premium";
  const showIcon = form.category === "core";
  const categoryInfo = COURSE_CATEGORIES.find((c) => c.value === form.category);

  const save = async () => {
    if (!form.title.trim()) {
      onError("Course title is required");
      return;
    }
    if (!form.description.trim()) {
      onError("Description is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.filter((f) => f.trim()),
      };
      const res = await fetch(
        course ? `/api/admin/courses/${course._id}` : "/api/admin/courses",
        {
          method: course ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        onSaved((await res.json()) as Course, !course);
      } else {
        onError("Failed to save course");
      }
    } catch {
      onError("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const orderInput = (
    <div>
      <label className={labelClass}>Display Order</label>
      <input
        type="number"
        min={0}
        value={form.order}
        onChange={(e) =>
          setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))
        }
        className={inputClass}
      />
    </div>
  );

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
            {course ? "Edit Course" : "Create Course"}
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
          {/* Category */}
          <div>
            <label className={labelClass}>Category *</label>
            <div className="grid grid-cols-3 gap-2">
              {COURSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      category: cat.value as Course["category"],
                    }))
                  }
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    form.category === cat.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {categoryInfo && (
              <p className="mt-1.5 text-xs text-gray-400">
                {categoryInfo.hint}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>
              {form.category === "premium"
                ? "Session Format Title (e.g. 1-on-1)"
                : "Course Title"}{" "}
              *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder={
                form.category === "premium"
                  ? "e.g. 1-on-1"
                  : "e.g. Communication Skills"
              }
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Short description shown on the website card"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Price + order (pricing / premium) */}
          {showPricing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 1,000"
                  className={inputClass}
                />
              </div>
              {orderInput}
            </div>
          )}

          {/* Icon + order (core) */}
          {showIcon && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Icon</label>
                <select
                  value={form.iconKey}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, iconKey: e.target.value }))
                  }
                  className={`${inputClass} bg-white`}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {orderInput}
            </div>
          )}

          {/* Features (pricing / premium) */}
          {showPricing && (
            <BulletListInput
              label="Features / Inclusions"
              items={form.features}
              onChange={(features) => setForm((f) => ({ ...f, features }))}
              placeholder="Feature"
              addLabel="Add Feature"
            />
          )}

          {/* Featured toggle (pricing / premium) */}
          {showPricing && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Mark as &quot;Most Popular&quot;
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shows a highlighted badge and elevated card style
                </p>
              </div>
              <Toggle
                checked={form.featured}
                onChange={() =>
                  setForm((f) => ({ ...f, featured: !f.featured }))
                }
                label="Mark as Most Popular"
                onClass="bg-amber-500"
              />
            </div>
          )}

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Publish to website
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                When active, this course appears on the homepage
              </p>
            </div>
            <Toggle
              checked={form.isActive}
              onChange={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              label="Publish to website"
              onClass="bg-green-500"
            />
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
            {course ? "Save Changes" : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
