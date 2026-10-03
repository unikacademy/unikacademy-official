"use client";

import { useCallback, useMemo, useState } from "react";
import { JOB_TYPES, JOB_WORKMODES, type Job } from "@/modules/jobs/types";
import { JobFormModal } from "@/modules/jobs/components/JobFormModal";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/modules/dashboard/format";
import {
  bulkResultMessage,
  deleteEach,
  patchEach,
} from "@/modules/dashboard/bulk";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { StatusPill } from "@/modules/dashboard/components/StatusPill";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { ListView } from "@/modules/dashboard/list/ListView";
import { useListView } from "@/modules/dashboard/list/useListView";
import type {
  ListBulkAction,
  ListColumn,
  ListFilter,
} from "@/modules/dashboard/list/types";

const ENDPOINT = "/api/admin/jobs";

const FILTERS: ListFilter<Job>[] = [
  { id: "title", type: "text", label: "Title", value: (j) => j.title },
  {
    id: "type",
    type: "select",
    label: "Type",
    options: JOB_TYPES.map((t) => ({ value: t, label: t })),
    value: (j) => j.type,
  },
  {
    id: "workMode",
    type: "select",
    label: "Work mode",
    options: JOB_WORKMODES.map((w) => ({ value: w, label: w })),
    value: (j) => j.workMode,
  },
  {
    id: "live",
    type: "select",
    label: "Visibility",
    options: [
      { value: "live", label: "Live" },
      { value: "hidden", label: "Hidden" },
    ],
    value: (j) => (j.isActive ? "live" : "hidden"),
  },
];

const getId = (j: Job) => j._id;

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

  const handleSaved = (saved: Job, created: boolean) => {
    setRows((prev) =>
      created
        ? [saved, ...prev]
        : prev.map((j) => (j._id === saved._id ? saved : j)),
    );
    showToast(created ? "Job created" : "Job updated");
    setForm(null);
  };

  const toggleActive = useCallback(
    async (job: Job) => {
      const res = await fetch(`${ENDPOINT}/${job._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !job.isActive }),
      }).catch(() => null);
      if (res?.ok) {
        patchLocal(job._id, { isActive: !job.isActive });
        showToast(
          job.isActive ? "Job hidden from website" : "Job published to website",
        );
      } else {
        showToast("Failed to update job", "error");
      }
    },
    [patchLocal, showToast],
  );

  const columns = useMemo<ListColumn<Job>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        hideable: false,
        sortValue: (j) => j.title.toLowerCase(),
        cell: (j) => (
          <span className="font-medium text-gray-900">{j.title}</span>
        ),
      },
      {
        id: "live",
        header: "Website",
        sortValue: (j) => (j.isActive ? 0 : 1),
        cell: (j) =>
          canManage ? (
            <span
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch
                size="sm"
                checked={j.isActive}
                onCheckedChange={() => void toggleActive(j)}
                aria-label={
                  j.isActive ? "Hide from website" : "Publish to website"
                }
              />
              <span className="text-xs text-gray-500">
                {j.isActive ? "Live" : "Hidden"}
              </span>
            </span>
          ) : (
            <StatusPill tone={j.isActive ? "green" : "gray"}>
              {j.isActive ? "Live" : "Hidden"}
            </StatusPill>
          ),
      },
      {
        id: "type",
        header: "Type",
        sortValue: (j) => j.type,
        cell: (j) => <StatusPill tone="blue">{j.type}</StatusPill>,
      },
      {
        id: "workMode",
        header: "Work mode",
        sortValue: (j) => j.workMode,
        cell: (j) => <span className="text-gray-600">{j.workMode}</span>,
      },
      {
        id: "responsibilities",
        header: "Responsibilities",
        className: "max-w-[320px]",
        cell: (j) => (
          <span className="block truncate text-gray-500">
            {j.responsibilities.length
              ? `${j.responsibilities[0]}${j.responsibilities.length > 1 ? ` (+${j.responsibilities.length - 1} more)` : ""}`
              : "—"}
          </span>
        ),
      },
      {
        id: "eligibility",
        header: "Eligibility",
        defaultHidden: true,
        className: "max-w-[280px]",
        cell: (j) => (
          <span className="block truncate text-gray-500">
            {j.eligibility.join(" · ") || "—"}
          </span>
        ),
      },
      {
        id: "created",
        header: "Created",
        sortValue: (j) => j.createdAt,
        cell: (j) => (
          <span className="text-gray-600">{formatDate(j.createdAt)}</span>
        ),
      },
    ],
    [canManage, toggleActive],
  );

  const list = useListView({
    listId: "jobs",
    rows: jobs,
    columns,
    filters: FILTERS,
    defaultSort: { id: "created", direction: "desc" },
    getRowId: getId,
  });

  const report = (r: { text: string; ok: boolean }) =>
    showToast(r.text, r.ok ? "success" : "error");

  const setVisibility = async (selected: Job[], isActive: boolean) => {
    const failed = await patchEach(ENDPOINT, selected, { isActive }, (j) =>
      patchLocal(j._id, { isActive }),
    );
    report(
      bulkResultMessage(
        isActive ? "Published" : "Hid",
        "job",
        selected.length,
        failed,
      ),
    );
  };

  const bulkActions: ListBulkAction<Job>[] = canManage
    ? [
        {
          id: "publish",
          label: "Publish to website",
          run: (s) => setVisibility(s, true),
        },
        {
          id: "hide",
          label: "Hide from website",
          run: (s) => setVisibility(s, false),
        },
        {
          id: "delete",
          label: "Delete",
          destructive: true,
          confirm: {
            title: "Delete job postings?",
            description: (n) =>
              `This permanently deletes ${n} job posting${n > 1 ? "s" : ""} and removes ${n > 1 ? "them" : "it"} from the Careers page.`,
            actionLabel: "Delete",
          },
          run: async (selected) => {
            const failed = await deleteEach(selected, remove);
            report(
              bulkResultMessage("Deleted", "job", selected.length, failed),
            );
          },
        },
      ]
    : [];

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

      <PageHeader
        title="Job Postings"
        onRefresh={refresh}
        refreshing={refreshing}
        primaryAction={
          canManage
            ? {
                label: "Add Job Posting",
                onClick: () => setForm({ job: null }),
              }
            : undefined
        }
      />

      <ListView
        list={list}
        columns={columns}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={canManage ? (job) => setForm({ job }) : undefined}
        timestamp={(j) => j.createdAt}
        bulkActions={bulkActions}
        loading={loading}
        emptyMessage="No job postings yet"
      />
    </>
  );
}
