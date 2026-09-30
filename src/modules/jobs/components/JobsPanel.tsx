"use client";

import { useCallback, useState } from "react";
import type { Job } from "@/modules/jobs/types";
import { JobFormModal } from "@/modules/jobs/components/JobFormModal";
import { formatDate } from "@/modules/dashboard/format";
import { StatIcon } from "@/modules/dashboard/icons";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PanelToolbar } from "@/modules/dashboard/components/PanelToolbar";
import { StatsCards } from "@/modules/dashboard/components/StatsCards";
import { ConfirmModal } from "@/modules/dashboard/components/ConfirmModal";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";

const ENDPOINT = "/api/admin/jobs";

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function JobsPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const {
    rows: jobs,
    setRows,
    loading,
    refreshing,
    refresh,
    patchLocal,
    remove,
  } = useAdminRecords<Job>(ENDPOINT, handleError);

  // null = closed; { job: null } = create; { job } = edit
  const [form, setForm] = useState<{ job: Job | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const handleSaved = (saved: Job, created: boolean) => {
    setRows((prev) =>
      created
        ? [saved, ...prev]
        : prev.map((j) => (j._id === saved._id ? saved : j)),
    );
    showToast(created ? "Job created" : "Job updated");
    setForm(null);
  };

  const toggleActive = async (job: Job) => {
    const res = await fetch(`${ENDPOINT}/${job._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !job.isActive }),
    });
    if (res.ok) {
      patchLocal(job._id, { isActive: !job.isActive });
      showToast(
        job.isActive ? "Job hidden from website" : "Job published to website",
      );
    } else {
      showToast("Failed to update job", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (await remove(deleteTarget._id)) showToast("Record deleted");
    else showToast("Failed to delete record", "error");
    setDeleteTarget(null);
  };

  const active = jobs.filter((j) => j.isActive).length;

  return (
    <>
      <ToastContainer toasts={toasts} />

      {form && (
        <JobFormModal
          job={form.job}
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
        summary={`${jobs.length} posting${jobs.length !== 1 ? "s" : ""} total`}
        refreshing={refreshing}
        onRefresh={refresh}
      >
        {canManage && (
          <button
            onClick={() => setForm({ job: null })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
          >
            <PlusIcon />
            New Job Posting
          </button>
        )}
      </PanelToolbar>

      <StatsCards
        loading={loading}
        cards={[
          {
            label: "Total Postings",
            value: jobs.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="briefcase" />,
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
            value: jobs.length - active,
            bgColor: "bg-gray-100",
            textColor: "text-gray-500",
            icon: <StatIcon name="eyeOff" />,
          },
        ]}
      />

      {loading ? (
        /* Skeleton cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
            >
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">No job postings yet</p>
          {canManage && (
            <button
              onClick={() => setForm({ job: null })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Create your first posting →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-primary leading-tight truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
                {canManage && (
                  <button
                    role="switch"
                    aria-checked={job.isActive}
                    aria-label={`Publish ${job.title} to website`}
                    onClick={() => toggleActive(job)}
                    title={
                      job.isActive
                        ? "Click to hide from website"
                        : "Click to publish to website"
                    }
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${job.isActive ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${job.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {job.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                  {job.workMode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {job.isActive ? "Live" : "Hidden"}
                </span>
              </div>

              {/* Responsibilities preview */}
              {job.responsibilities.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Responsibilities
                  </p>
                  <ul className="space-y-1">
                    {job.responsibilities.slice(0, 3).map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <span className="text-accent mt-0.5 flex-shrink-0">
                          •
                        </span>
                        {r}
                      </li>
                    ))}
                    {job.responsibilities.length > 3 && (
                      <li className="text-xs text-gray-400 pl-3.5">
                        +{job.responsibilities.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Actions */}
              {canManage && (
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => setForm({ job })}
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
                    onClick={() => setDeleteTarget(job)}
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
      )}
    </>
  );
}
