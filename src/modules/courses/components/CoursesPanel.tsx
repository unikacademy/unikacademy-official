"use client";

import { useCallback, useState } from "react";
import { COURSE_CATEGORIES, type Course } from "@/modules/courses/types";
import { CourseFormModal } from "@/modules/courses/components/CourseFormModal";
import { StatIcon } from "@/modules/dashboard/icons";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PanelToolbar } from "@/modules/dashboard/components/PanelToolbar";
import { StatsCards } from "@/modules/dashboard/components/StatsCards";
import { ConfirmModal } from "@/modules/dashboard/components/ConfirmModal";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";

const ENDPOINT = "/api/admin/courses";
const CATEGORY_ORDER: Course["category"][] = ["core", "pricing", "premium"];

export function CoursesPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const {
    rows: courses,
    setRows,
    loading,
    refreshing,
    refresh,
    patchLocal,
    remove,
  } = useAdminRecords<Course>(ENDPOINT, handleError);

  // null = closed; { course: null } = create; { course } = edit
  const [form, setForm] = useState<{ course: Course | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const handleSaved = (saved: Course, created: boolean) => {
    setRows((prev) =>
      created
        ? [saved, ...prev]
        : prev.map((c) => (c._id === saved._id ? saved : c)),
    );
    showToast(created ? "Course created" : "Course updated");
    setForm(null);
  };

  const toggleActive = async (course: Course) => {
    const res = await fetch(`${ENDPOINT}/${course._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !course.isActive }),
    });
    if (res.ok) {
      patchLocal(course._id, { isActive: !course.isActive });
      showToast(
        course.isActive
          ? "Course hidden from website"
          : "Course published to website",
      );
    } else {
      showToast("Failed to update course", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (await remove(deleteTarget._id)) showToast("Record deleted");
    else showToast("Failed to delete record", "error");
    setDeleteTarget(null);
  };

  const active = courses.filter((c) => c.isActive).length;

  return (
    <>
      <ToastContainer toasts={toasts} />

      {form && (
        <CourseFormModal
          course={form.course}
          onClose={() => setForm(null)}
          onSaved={handleSaved}
          onError={handleError}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <PanelToolbar
        summary={`${courses.length} course${courses.length !== 1 ? "s" : ""} total`}
        refreshing={refreshing}
        onRefresh={refresh}
      >
        {canManage && (
          <button
            onClick={() => setForm({ course: null })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Course
          </button>
        )}
      </PanelToolbar>

      <StatsCards
        loading={loading}
        cards={[
          {
            label: "Total Courses",
            value: courses.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="bookOpen" />,
          },
          {
            label: "Active (Live)",
            value: active,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            icon: <StatIcon name="checkCircle" />,
          },
          {
            label: "Hidden",
            value: courses.length - active,
            bgColor: "bg-gray-100",
            textColor: "text-gray-500",
            icon: <StatIcon name="eyeOff" />,
          },
        ]}
      />

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[240px] flex flex-col items-center justify-center text-gray-400 gap-3">
          <svg
            className="w-12 h-12 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <p className="text-sm font-medium">No courses yet</p>
          {canManage && (
            <button
              onClick={() => setForm({ course: null })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Create your first course →
            </button>
          )}
        </div>
      ) : (
        /* Group courses by category */
        CATEGORY_ORDER.map((cat) => {
          const catCourses = courses.filter((c) => c.category === cat);
          if (catCourses.length === 0) return null;
          const catLabel =
            COURSE_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
          return (
            <div key={cat} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                  {catLabel}s
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">
                  {catCourses.length} item{catCourses.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {catCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-primary leading-tight truncate">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      {canManage && (
                        <button
                          role="switch"
                          aria-checked={course.isActive}
                          aria-label={`Publish ${course.title} to website`}
                          onClick={() => toggleActive(course)}
                          title={
                            course.isActive
                              ? "Click to hide from website"
                              : "Click to publish"
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${course.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${course.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {course.price && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/15 text-accent">
                          ₹{course.price}
                        </span>
                      )}
                      {course.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                          Most Popular
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        Order: {course.order}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${course.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {course.isActive ? "Live" : "Hidden"}
                      </span>
                    </div>

                    {/* Features preview (pricing/premium) */}
                    {course.features.length > 0 && (
                      <ul className="space-y-1">
                        {course.features.slice(0, 3).map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <span className="text-accent mt-0.5 flex-shrink-0">
                              ✓
                            </span>
                            {f}
                          </li>
                        ))}
                        {course.features.length > 3 && (
                          <li className="text-xs text-gray-400 pl-3.5">
                            +{course.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Actions */}
                    {canManage && (
                      <div className="flex gap-2 pt-1 border-t border-gray-100">
                        <button
                          onClick={() => setForm({ course })}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(course)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
