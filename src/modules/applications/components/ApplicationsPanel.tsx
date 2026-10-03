"use client";

import { useCallback, useState } from "react";
import {
  APP_STATUSES,
  type Application,
  type AppStatus,
} from "@/modules/applications/types";
import { formatDate } from "@/modules/dashboard/format";
import { STATUS_LABEL } from "@/modules/dashboard/status";
import {
  bulkResultMessage,
  deleteEach,
  patchEach,
} from "@/modules/dashboard/bulk";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import { StatusBadge } from "@/modules/dashboard/components/StatusBadge";
import { SlideOver } from "@/modules/dashboard/components/SlideOver";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { ListView } from "@/modules/dashboard/list/ListView";
import { useListView } from "@/modules/dashboard/list/useListView";
import type {
  ListBulkAction,
  ListColumn,
  ListFilter,
} from "@/modules/dashboard/list/types";

const ENDPOINT = "/api/admin/applications";

const COLUMNS: ListColumn<Application>[] = [
  {
    id: "name",
    header: "Name",
    hideable: false,
    sortValue: (a) => a.name.toLowerCase(),
    cell: (a) => (
      <span className="flex items-center gap-2 font-medium text-gray-900">
        {a.status === "not_read" && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-blue-500"
            aria-label="Unread"
          />
        )}
        {a.name}
      </span>
    ),
  },
  {
    id: "position",
    header: "Position",
    sortValue: (a) => a.position.toLowerCase(),
    cell: (a) => <span className="text-gray-700">{a.position}</span>,
  },
  {
    id: "status",
    header: "Status",
    sortValue: (a) => a.status,
    cell: (a) => <StatusBadge status={a.status} />,
  },
  {
    id: "email",
    header: "Email",
    sortValue: (a) => a.email.toLowerCase(),
    cell: (a) => <span className="text-gray-600">{a.email}</span>,
  },
  {
    id: "phone",
    header: "Phone",
    cell: (a) => <span className="text-gray-600">{a.phone}</span>,
  },
  {
    id: "message",
    header: "Message",
    className: "max-w-[300px]",
    cell: (a) => (
      <span className="block truncate text-gray-500">{a.message || "—"}</span>
    ),
  },
  {
    id: "applied",
    header: "Applied",
    sortValue: (a) => a.createdAt,
    cell: (a) => (
      <span className="text-gray-600">{formatDate(a.createdAt)}</span>
    ),
  },
];

const FILTERS: ListFilter<Application>[] = [
  { id: "name", type: "text", label: "Name", value: (a) => a.name },
  { id: "position", type: "text", label: "Position", value: (a) => a.position },
  {
    id: "contact",
    type: "text",
    label: "Email / phone",
    value: (a) => [a.email, a.phone],
  },
  {
    id: "status",
    type: "select",
    label: "Status",
    options: APP_STATUSES.map((s) => ({ value: s.value, label: s.label })),
    value: (a) => a.status,
  },
];

const getId = (a: Application) => a._id;

export function ApplicationsPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, loading, refreshing, refresh, patchLocal, remove } =
    useAdminRecords<Application>(ENDPOINT, handleError);

  const list = useListView({
    listId: "applications",
    rows,
    columns: COLUMNS,
    filters: FILTERS,
    defaultSort: { id: "applied", direction: "desc" },
    getRowId: getId,
  });

  const [detailItem, setDetailItem] = useState<Application | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    patchLocal(id, { status: status as AppStatus });
    setDetailItem((prev) =>
      prev && prev._id === id ? { ...prev, status: status as AppStatus } : prev,
    );
    showToast("Status updated");
  };

  const report = (r: { text: string; ok: boolean }) =>
    showToast(r.text, r.ok ? "success" : "error");

  const bulkActions: ListBulkAction<Application>[] = canManage
    ? [
        ...APP_STATUSES.map((s) => ({
          id: `status-${s.value}`,
          label: `Mark as ${s.label}`,
          run: async (selected: Application[]) => {
            const failed = await patchEach(
              ENDPOINT,
              selected,
              { status: s.value },
              (a) => patchLocal(a._id, { status: s.value }),
            );
            report(
              bulkResultMessage(
                `Marked as ${STATUS_LABEL[s.value]}:`,
                "application",
                selected.length,
                failed,
              ),
            );
          },
        })),
        {
          id: "delete",
          label: "Delete",
          destructive: true,
          confirm: {
            title: "Delete applications?",
            description: (n: number) =>
              `This permanently deletes ${n} job application${n > 1 ? "s" : ""}. This can't be undone.`,
            actionLabel: "Delete",
          },
          run: async (selected: Application[]) => {
            const failed = await deleteEach(selected, remove);
            if (detailItem && selected.some((a) => a._id === detailItem._id)) {
              setDetailItem(null);
            }
            report(
              bulkResultMessage(
                "Deleted",
                "application",
                selected.length,
                failed,
              ),
            );
          },
        },
      ]
    : [];

  return (
    <>
      <ToastContainer toasts={toasts} />

      <SlideOver
        item={detailItem}
        section="applications"
        onClose={() => setDetailItem(null)}
        onStatusChange={handleStatusChange}
        statuses={APP_STATUSES}
        readOnly={!canManage}
      />

      <PageHeader
        title="Job Applications"
        onRefresh={refresh}
        refreshing={refreshing}
      />

      <ListView
        list={list}
        columns={COLUMNS}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={setDetailItem}
        timestamp={(a) => a.createdAt}
        bulkActions={bulkActions}
        loading={loading}
        emptyMessage="No job applications yet"
      />
    </>
  );
}
