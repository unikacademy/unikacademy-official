"use client";

import { useCallback, useState } from "react";
import { CONTACT_STATUSES, type ContactStatus } from "@/modules/contacts/types";
import {
  DEMO_STAGES,
  type Assignees,
  type DemoBooking,
} from "@/modules/demo-bookings/types";
import { BookingTypeBadge } from "@/modules/demo-bookings/components/BookingTypeBadge";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import { DemoAssignment } from "@/modules/demo-bookings/components/DemoAssignment";
import { formatDate, formatDateTimeIST } from "@/modules/dashboard/format";
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

const ENDPOINT = "/api/admin/demo-bookings";

const COLUMNS: ListColumn<DemoBooking>[] = [
  {
    id: "name",
    header: "Name",
    hideable: false,
    sortValue: (d) => d.name.toLowerCase(),
    cell: (d) => (
      <span className="flex items-center gap-2 font-medium text-gray-900">
        {d.status === "not_read" && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-blue-500"
            aria-label="Unread"
          />
        )}
        {d.name}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortValue: (d) => d.status,
    cell: (d) => <StatusBadge status={d.status} />,
  },
  {
    id: "course",
    header: "Course",
    sortValue: (d) => d.course.toLowerCase(),
    cell: (d) => <span className="text-gray-700">{d.course}</span>,
  },
  {
    id: "stage",
    header: "Demo",
    sortValue: (d) => DEMO_STAGES.findIndex((s) => s.value === d.demoStatus),
    cell: (d) => <DemoStageBadge stage={d.demoStatus} />,
  },
  {
    id: "scheduled",
    header: "Scheduled (IST)",
    sortValue: (d) => d.scheduledAt,
    cell: (d) => (
      <span className="text-gray-600">
        {d.scheduledAt ? formatDateTimeIST(d.scheduledAt) : "—"}
      </span>
    ),
  },
  {
    id: "teacher",
    header: "Teacher",
    sortValue: (d) => d.teacher?.fullName?.toLowerCase(),
    cell: (d) => (
      <span className="text-gray-600">
        {d.teacher?.fullName ?? d.teacher?.email ?? "—"}
      </span>
    ),
  },
  {
    id: "type",
    header: "Type",
    sortValue: (d) => d.bookingType,
    cell: (d) => <BookingTypeBadge type={d.bookingType} />,
  },
  {
    id: "company",
    header: "Company",
    sortValue: (d) => d.companyName?.toLowerCase(),
    cell: (d) => <span className="text-gray-600">{d.companyName || "—"}</span>,
  },
  {
    id: "phone",
    header: "Phone",
    cell: (d) => <span className="text-gray-600">{d.phone}</span>,
  },
  {
    id: "email",
    header: "Email",
    defaultHidden: true,
    cell: (d) => <span className="text-gray-600">{d.email || "—"}</span>,
  },
  {
    id: "student",
    header: "Student account",
    defaultHidden: true,
    cell: (d) => (
      <span className="text-gray-600">
        {d.student?.fullName ?? d.student?.email ?? "Not linked"}
      </span>
    ),
  },
  {
    id: "message",
    header: "Message",
    defaultHidden: true,
    className: "max-w-[280px]",
    cell: (d) => (
      <span className="block truncate text-gray-500">{d.message || "—"}</span>
    ),
  },
  {
    id: "booked",
    header: "Booked",
    sortValue: (d) => d.createdAt,
    cell: (d) => (
      <span className="text-gray-600">{formatDate(d.createdAt)}</span>
    ),
  },
];

const FILTERS: ListFilter<DemoBooking>[] = [
  {
    id: "name",
    type: "text",
    label: "Name / company",
    value: (d) => [d.name, d.companyName],
  },
  {
    id: "contact",
    type: "text",
    label: "Phone / email",
    value: (d) => [d.phone, d.email],
  },
  { id: "course", type: "text", label: "Course", value: (d) => d.course },
  {
    id: "teacher",
    type: "text",
    label: "Teacher",
    value: (d) => [d.teacher?.fullName, d.teacher?.email],
  },
  {
    id: "status",
    type: "select",
    label: "Status",
    options: CONTACT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
    value: (d) => d.status,
  },
  {
    id: "stage",
    type: "select",
    label: "Demo stage",
    options: DEMO_STAGES.map((s) => ({ value: s.value, label: s.label })),
    value: (d) => d.demoStatus,
  },
  {
    id: "type",
    type: "select",
    label: "Type",
    options: [
      { value: "individual", label: "Individual" },
      { value: "corporate", label: "Corporate" },
    ],
    value: (d) => d.bookingType,
  },
];

const getId = (d: DemoBooking) => d._id;

export function DemoBookingsPanel({
  canManage,
  canAssign,
}: {
  canManage: boolean;
  canAssign: boolean;
}) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, setRows, loading, refreshing, refresh, patchLocal, remove } =
    useAdminRecords<DemoBooking>(ENDPOINT, handleError);

  const list = useListView({
    listId: "demo-bookings",
    rows,
    columns: COLUMNS,
    filters: FILTERS,
    defaultSort: { id: "booked", direction: "desc" },
    getRowId: getId,
  });

  const [detailItem, setDetailItem] = useState<DemoBooking | null>(null);

  // Teacher/student pickers — loaded once, the first time a booking is opened
  const [assignees, setAssignees] = useState<Assignees | null>(null);
  const [assigneesRequested, setAssigneesRequested] = useState(false);

  const openDetail = (booking: DemoBooking) => {
    setDetailItem(booking);
    if (canAssign && !assigneesRequested) {
      setAssigneesRequested(true);
      fetch(`${ENDPOINT}/assignees`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data: Assignees) => setAssignees(data))
        .catch(() => {
          setAssigneesRequested(false); // allow a retry on next open
          showToast("Failed to load teachers and students", "error");
        });
    }
  };

  const handleAssigned = (saved: DemoBooking) => {
    setRows((prev) => prev.map((d) => (d._id === saved._id ? saved : d)));
    setDetailItem(saved);
    showToast("Assignment saved");
  };

  const handleStatusChange = (id: string, status: string) => {
    patchLocal(id, { status: status as ContactStatus });
    setDetailItem((prev) =>
      prev && prev._id === id
        ? { ...prev, status: status as ContactStatus }
        : prev,
    );
    showToast("Status updated");
  };

  const report = (r: { text: string; ok: boolean }) =>
    showToast(r.text, r.ok ? "success" : "error");

  const bulkActions: ListBulkAction<DemoBooking>[] = canManage
    ? [
        ...CONTACT_STATUSES.map((s) => ({
          id: `status-${s.value}`,
          label: `Mark as ${s.label}`,
          run: async (selected: DemoBooking[]) => {
            const failed = await patchEach(
              ENDPOINT,
              selected,
              { status: s.value },
              (d) => patchLocal(d._id, { status: s.value }),
            );
            report(
              bulkResultMessage(
                `Marked as ${STATUS_LABEL[s.value]}:`,
                "booking",
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
            title: "Delete demo bookings?",
            description: (n: number) =>
              `This permanently deletes ${n} demo booking${n > 1 ? "s" : ""}, including any teacher assignment. This can't be undone.`,
            actionLabel: "Delete",
          },
          run: async (selected: DemoBooking[]) => {
            const failed = await deleteEach(selected, remove);
            if (detailItem && selected.some((d) => d._id === detailItem._id)) {
              setDetailItem(null);
            }
            report(
              bulkResultMessage("Deleted", "booking", selected.length, failed),
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
        section="demo-bookings"
        onClose={() => setDetailItem(null)}
        onStatusChange={handleStatusChange}
        statuses={CONTACT_STATUSES}
        readOnly={!canManage}
        extra={
          detailItem && (
            <DemoAssignment
              key={detailItem._id}
              booking={detailItem}
              canAssign={canAssign}
              assignees={assignees}
              onSaved={handleAssigned}
            />
          )
        }
      />

      <PageHeader
        title="Demo Bookings"
        onRefresh={refresh}
        refreshing={refreshing}
      />

      <ListView
        list={list}
        columns={COLUMNS}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={openDetail}
        timestamp={(d) => d.createdAt}
        bulkActions={bulkActions}
        loading={loading}
        emptyMessage="No demo bookings yet"
      />
    </>
  );
}
