"use client";

import { useCallback, useState } from "react";
import {
  APP_STATUSES,
  type Application,
  type AppStatus,
} from "@/modules/applications/types";
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

const ENDPOINT = "/api/admin/applications";
const FILTER_OPTIONS = [{ value: "all", label: "All" }, ...APP_STATUSES];
const searchText = (a: Application) => [a.name, a.email, a.phone, a.position];

export function ApplicationsPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, loading, refreshing, refresh, patchLocal, remove } =
    useAdminRecords<Application>(ENDPOINT, handleError);
  const table = useTableControls(rows, searchText);

  const [detailItem, setDetailItem] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    patchLocal(id, { status: status as AppStatus });
    setDetailItem((prev) =>
      prev && prev._id === id ? { ...prev, status: status as AppStatus } : prev,
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

  const unread = rows.filter((a) => a.status === "not_read").length;

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
        section="applications"
        onClose={() => setDetailItem(null)}
        onStatusChange={handleStatusChange}
        statuses={APP_STATUSES}
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
            label: "Total Applications",
            value: rows.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="document" />,
          },
          {
            label: "Unread",
            value: unread,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            icon: <StatIcon name="bell" />,
          },
          {
            label: "Shortlisted",
            value: rows.filter((a) => a.status === "shortlisted").length,
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            icon: <StatIcon name="star" />,
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
          placeholder="Search by name, email, phone or position…"
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
        {!loading && table.filtered.length === 0 ? (
          <EmptyState
            label={
              table.isFiltering
                ? "No results match your filters"
                : "No job applications yet"
            }
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                  <SortableTh
                    label="Position"
                    sortKey="position"
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
                  <SkeletonRows cols={canManage ? 8 : 7} />
                ) : (
                  table.filtered.map((a) => (
                    <tr
                      key={a._id}
                      className={rowClass(a.status)}
                      onClick={() => setDetailItem(a)}
                    >
                      <td
                        className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}
                      >
                        {a.name}
                      </td>
                      <td className={tdClass}>
                        <a
                          href={`mailto:${a.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-accent hover:underline"
                        >
                          {a.email}
                        </a>
                      </td>
                      <td className={`${tdClass} whitespace-nowrap`}>
                        <a
                          href={`tel:${a.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-600 hover:text-accent transition"
                        >
                          {a.phone}
                        </a>
                      </td>
                      <td className={tdClass}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {a.position}
                        </span>
                      </td>
                      <td
                        className={`${tdClass} text-gray-600 max-w-xs truncate`}
                      >
                        {a.message || "—"}
                      </td>
                      <td className={tdClass}>
                        <StatusBadge status={a.status} />
                      </td>
                      <td
                        className={`${tdClass} text-gray-500 whitespace-nowrap`}
                      >
                        {formatDate(a.createdAt)}
                      </td>
                      {canManage && (
                        <td className={tdClass}>
                          <ActionDropdown
                            id={a._id}
                            name={a.name}
                            currentStatus={a.status}
                            statuses={APP_STATUSES}
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
