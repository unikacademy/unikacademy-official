"use client";

import { useCallback, useState } from "react";
import { CONTACT_STATUSES, type ContactStatus } from "@/modules/contacts/types";
import type { Assignees, DemoBooking } from "@/modules/demo-bookings/types";
import { BookingTypeBadge } from "@/modules/demo-bookings/components/BookingTypeBadge";
import { DemoStageBadge } from "@/modules/demo-bookings/components/DemoStageBadge";
import { DemoAssignment } from "@/modules/demo-bookings/components/DemoAssignment";
import { formatDate, formatDateTimeIST } from "@/modules/dashboard/format";
import { thClass, tdClass, rowClass } from "@/modules/dashboard/table";
import { StatIcon } from "@/modules/dashboard/icons";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { useTableControls } from "@/modules/dashboard/hooks/useTableControls";
import { PanelToolbar } from "@/modules/dashboard/components/PanelToolbar";
import { StatsCards } from "@/modules/dashboard/components/StatsCards";
import { SearchAndFilterBar } from "@/modules/dashboard/components/SearchAndFilterBar";
import { SortableTh } from "@/modules/dashboard/components/SortableTh";
import { SkeletonRows } from "@/modules/dashboard/components/SkeletonRows";
import { StatusBadge } from "@/modules/dashboard/components/StatusBadge";
import { ActionDropdown } from "@/modules/dashboard/components/ActionDropdown";
import { SlideOver } from "@/modules/dashboard/components/SlideOver";
import { ConfirmModal } from "@/modules/dashboard/components/ConfirmModal";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { EmptyState } from "@/modules/dashboard/components/EmptyState";

const ENDPOINT = "/api/admin/demo-bookings";
// Demo bookings share the contact statuses (not read / read / replied)
const FILTER_OPTIONS = [{ value: "all", label: "All" }, ...CONTACT_STATUSES];
const searchText = (d: DemoBooking) => [
  d.name,
  d.email,
  d.phone,
  d.companyName,
  d.bookingType,
  d.teacher?.fullName,
  d.student?.fullName,
];

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
  const table = useTableControls(rows, searchText);

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
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    patchLocal(id, { status: status as ContactStatus });
    setDetailItem((prev) =>
      prev && prev._id === id
        ? { ...prev, status: status as ContactStatus }
        : prev,
    );
    showToast("Status updated");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    if (await remove(id)) {
      if (detailItem?._id === id) setDetailItem(null);
      showToast("Record deleted");
    } else {
      showToast("Failed to delete record", "error");
    }
    setDeleteTarget(null);
  };

  const unread = rows.filter((d) => d.status === "not_read").length;
  const cols = canManage ? 11 : 10;

  return (
    <>
      <ToastContainer toasts={toasts} />

      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

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

      <PanelToolbar
        summary={`${rows.length} total${unread > 0 ? ` · ${unread} unread` : ""}`}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <StatsCards
        loading={loading}
        cards={[
          {
            label: "Total Bookings",
            value: rows.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="calendar" />,
          },
          {
            label: "Unread",
            value: unread,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            icon: <StatIcon name="bell" />,
          },
          {
            label: "Replied",
            value: rows.filter((d) => d.status === "replied").length,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            icon: <StatIcon name="checkCircle" />,
          },
          {
            label: "Corporate",
            value: rows.filter((d) => d.bookingType === "corporate").length,
            bgColor: "bg-[#c0a84f]/10",
            textColor: "text-[#8a742f]",
            icon: <StatIcon name="building" />,
          },
        ]}
      />

      {!loading && (
        <SearchAndFilterBar
          query={table.query}
          onQueryChange={table.setQuery}
          activeFilter={table.statusFilter}
          onFilterChange={table.setStatusFilter}
          filterOptions={FILTER_OPTIONS}
          resultCount={table.filtered.length}
          placeholder="Search by name, email, phone or company…"
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
        {!loading && table.filtered.length === 0 ? (
          <EmptyState
            label={
              table.isFiltering
                ? "No results match your filters"
                : "No demo bookings yet"
            }
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-380px)] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
                <tr>
                  <SortableTh
                    label="Type"
                    sortKey="bookingType"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <SortableTh
                    label="Name"
                    sortKey="name"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <th className={thClass}>Company</th>
                  <th className={thClass}>Phone</th>
                  <th className={thClass}>Email</th>
                  <SortableTh
                    label="Course"
                    sortKey="course"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <SortableTh
                    label="Demo"
                    sortKey="scheduledAt"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <th className={thClass}>Message</th>
                  <SortableTh
                    label="Status"
                    sortKey="status"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <SortableTh
                    label="Date"
                    sortKey="createdAt"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  {canManage && <th className={thClass}>Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <SkeletonRows cols={cols} />
                ) : (
                  table.filtered.map((d) => (
                    <tr
                      key={d._id}
                      className={rowClass(d.status)}
                      onClick={() => openDetail(d)}
                    >
                      <td className={tdClass}>
                        <BookingTypeBadge type={d.bookingType} />
                      </td>
                      <td
                        className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}
                      >
                        {d.name}
                      </td>
                      <td
                        className={`${tdClass} text-gray-600 whitespace-nowrap`}
                      >
                        {d.companyName || "—"}
                      </td>
                      <td className={`${tdClass} whitespace-nowrap`}>
                        <a
                          href={`tel:${d.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-600 hover:text-accent transition"
                        >
                          {d.phone}
                        </a>
                      </td>
                      <td className={tdClass}>
                        {d.email ? (
                          <a
                            href={`mailto:${d.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-accent hover:underline"
                          >
                            {d.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                          {d.course}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex flex-col items-start gap-1">
                          <DemoStageBadge stage={d.demoStatus} />
                          {d.scheduledAt && (
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                              {formatDateTimeIST(d.scheduledAt)}
                            </span>
                          )}
                          {d.teacher && (
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              with {d.teacher.fullName ?? d.teacher.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`${tdClass} text-gray-600 max-w-xs truncate`}
                      >
                        {d.message || "—"}
                      </td>
                      <td className={tdClass}>
                        <StatusBadge status={d.status} />
                      </td>
                      <td
                        className={`${tdClass} text-gray-500 whitespace-nowrap`}
                      >
                        {formatDate(d.createdAt)}
                      </td>
                      {canManage && (
                        <td className={tdClass}>
                          <ActionDropdown
                            id={d._id}
                            name={d.name}
                            currentStatus={d.status}
                            statuses={CONTACT_STATUSES}
                            endpoint={ENDPOINT}
                            onStatusChange={handleStatusChange}
                            onDelete={(id, name) =>
                              setDeleteTarget({ id, name })
                            }
                          />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
