"use client";

import { useCallback, useState } from "react";
import {
  CONTACT_STATUSES,
  type Contact,
  type ContactStatus,
} from "@/modules/contacts/types";
import { formatDate } from "@/modules/dashboard/format";
import {
  bulkResultMessage,
  deleteEach,
  patchEach,
} from "@/modules/dashboard/bulk";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import {
  StatusPill,
  type PillTone,
} from "@/modules/dashboard/components/StatusPill";
import { SlideOver } from "@/modules/dashboard/components/SlideOver";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { ListView } from "@/modules/dashboard/list/ListView";
import { useListView } from "@/modules/dashboard/list/useListView";
import type {
  ListBulkAction,
  ListColumn,
  ListFilter,
} from "@/modules/dashboard/list/types";

const ENDPOINT = "/api/admin/contacts";

const STATUS_TONE: Record<ContactStatus, PillTone> = {
  not_read: "blue",
  read: "gray",
  replied: "green",
};
const statusLabel = (s: ContactStatus) =>
  CONTACT_STATUSES.find((x) => x.value === s)?.label ?? s;

const COLUMNS: ListColumn<Contact>[] = [
  {
    id: "name",
    header: "Name",
    hideable: false,
    sortValue: (c) => c.name.toLowerCase(),
    cell: (c) => (
      <span className="flex items-center gap-2 font-medium text-gray-900">
        {c.status === "not_read" && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-blue-500"
            aria-label="Unread"
          />
        )}
        {c.name}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortValue: (c) => c.status,
    cell: (c) => (
      <StatusPill tone={STATUS_TONE[c.status]}>
        {statusLabel(c.status)}
      </StatusPill>
    ),
  },
  {
    id: "email",
    header: "Email",
    sortValue: (c) => c.email.toLowerCase(),
    cell: (c) => <span className="text-gray-600">{c.email}</span>,
  },
  {
    id: "phone",
    header: "Phone",
    cell: (c) => <span className="text-gray-600">{c.phone || "—"}</span>,
  },
  {
    id: "message",
    header: "Message",
    className: "max-w-[320px]",
    cell: (c) => (
      <span className="block truncate text-gray-500">{c.message}</span>
    ),
  },
  {
    id: "received",
    header: "Received",
    sortValue: (c) => c.createdAt,
    cell: (c) => (
      <span className="text-gray-600">{formatDate(c.createdAt)}</span>
    ),
  },
];

const FILTERS: ListFilter<Contact>[] = [
  { id: "name", type: "text", label: "Name", value: (c) => c.name },
  { id: "email", type: "text", label: "Email", value: (c) => c.email },
  { id: "phone", type: "text", label: "Phone", value: (c) => c.phone },
  {
    id: "status",
    type: "select",
    label: "Status",
    options: CONTACT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
    value: (c) => c.status,
  },
];

const getId = (c: Contact) => c._id;

export function ContactsPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, loading, refreshing, refresh, patchLocal, remove } =
    useAdminRecords<Contact>(ENDPOINT, handleError);

  const list = useListView({
    listId: "contacts",
    rows,
    columns: COLUMNS,
    filters: FILTERS,
    defaultSort: { id: "received", direction: "desc" },
    getRowId: getId,
  });

  const [detailItem, setDetailItem] = useState<Contact | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    patchLocal(id, { status: status as ContactStatus });
    setDetailItem((prev) =>
      prev && prev._id === id
        ? { ...prev, status: status as ContactStatus }
        : prev,
    );
    showToast("Status updated");
  };

  // Bulk: PATCH each selected row; report how many failed
  const report = (r: { text: string; ok: boolean }) =>
    showToast(r.text, r.ok ? "success" : "error");

  const setStatus = async (selected: Contact[], status: ContactStatus) => {
    const failed = await patchEach(ENDPOINT, selected, { status }, (c) =>
      patchLocal(c._id, { status }),
    );
    report(
      bulkResultMessage(
        `Marked as ${statusLabel(status)}:`,
        "message",
        selected.length,
        failed,
      ),
    );
  };

  const deleteRows = async (selected: Contact[]) => {
    const failed = await deleteEach(selected, remove);
    if (detailItem && selected.some((c) => c._id === detailItem._id)) {
      setDetailItem(null);
    }
    report(bulkResultMessage("Deleted", "message", selected.length, failed));
  };

  const bulkActions: ListBulkAction<Contact>[] = canManage
    ? [
        ...CONTACT_STATUSES.map((s) => ({
          id: `status-${s.value}`,
          label: `Mark as ${s.label}`,
          run: (selected: Contact[]) => setStatus(selected, s.value),
        })),
        {
          id: "delete",
          label: "Delete",
          destructive: true,
          confirm: {
            title: "Delete messages?",
            description: (n: number) =>
              `This permanently deletes ${n} contact message${n > 1 ? "s" : ""}. This can't be undone.`,
            actionLabel: "Delete",
          },
          run: deleteRows,
        },
      ]
    : [];

  return (
    <>
      <ToastContainer toasts={toasts} />

      <SlideOver
        item={detailItem}
        section="contacts"
        onClose={() => setDetailItem(null)}
        onStatusChange={handleStatusChange}
        statuses={CONTACT_STATUSES}
        readOnly={!canManage}
      />

      <PageHeader
        title="Contact Messages"
        onRefresh={refresh}
        refreshing={refreshing}
      />

      <ListView
        list={list}
        columns={COLUMNS}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={setDetailItem}
        timestamp={(c) => c.createdAt}
        bulkActions={bulkActions}
        loading={loading}
        emptyMessage="No contact messages yet"
      />
    </>
  );
}
