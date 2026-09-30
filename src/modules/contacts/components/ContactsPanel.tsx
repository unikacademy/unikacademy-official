"use client";

import { useCallback, useState } from "react";
import {
  CONTACT_STATUSES,
  type Contact,
  type ContactStatus,
} from "@/modules/contacts/types";
import { formatDate } from "@/modules/dashboard/format";
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

const ENDPOINT = "/api/admin/contacts";
const FILTER_OPTIONS = [{ value: "all", label: "All" }, ...CONTACT_STATUSES];
const searchText = (c: Contact) => [c.name, c.email, c.phone];

export function ContactsPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, loading, refreshing, refresh, patchLocal, remove } =
    useAdminRecords<Contact>(ENDPOINT, handleError);
  const table = useTableControls(rows, searchText);

  const [detailItem, setDetailItem] = useState<Contact | null>(null);
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

  const unread = rows.filter((c) => c.status === "not_read").length;

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
        section="contacts"
        onClose={() => setDetailItem(null)}
        onStatusChange={handleStatusChange}
        statuses={CONTACT_STATUSES}
        readOnly={!canManage}
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
            label: "Total Messages",
            value: rows.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="mail" />,
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
            value: rows.filter((c) => c.status === "replied").length,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            icon: <StatIcon name="checkCircle" />,
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
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
        {!loading && table.filtered.length === 0 ? (
          <EmptyState
            label={
              table.isFiltering
                ? "No results match your filters"
                : "No contact messages yet"
            }
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                    label="Name"
                    sortKey="name"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <SortableTh
                    label="Email"
                    sortKey="email"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <th className={thClass}>Phone</th>
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
                  <SkeletonRows cols={canManage ? 7 : 6} />
                ) : (
                  table.filtered.map((c) => (
                    <tr
                      key={c._id}
                      className={rowClass(c.status)}
                      onClick={() => setDetailItem(c)}
                    >
                      <td
                        className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}
                      >
                        {c.name}
                      </td>
                      <td className={tdClass}>
                        <a
                          href={`mailto:${c.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-accent hover:underline"
                        >
                          {c.email}
                        </a>
                      </td>
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {c.phone ? (
                          <a
                            href={`tel:${c.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-600 hover:text-accent transition"
                          >
                            {c.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td
                        className={`${tdClass} text-gray-600 max-w-xs truncate`}
                      >
                        {c.message}
                      </td>
                      <td className={tdClass}>
                        <StatusBadge status={c.status} />
                      </td>
                      <td
                        className={`${tdClass} text-gray-500 whitespace-nowrap`}
                      >
                        {formatDate(c.createdAt)}
                      </td>
                      {canManage && (
                        <td className={tdClass}>
                          <ActionDropdown
                            id={c._id}
                            name={c.name}
                            currentStatus={c.status}
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
