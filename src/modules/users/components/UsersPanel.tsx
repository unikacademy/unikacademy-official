"use client";

import { useCallback, useMemo, useState } from "react";
import { ROLES, ROLE_LABELS, type RoleId } from "@/modules/auth/permissions";
import type { UserWithRoles } from "@/modules/users/types";
import { formatDate } from "@/modules/dashboard/format";
import { thClass, tdClass } from "@/modules/dashboard/table";
import { StatIcon } from "@/modules/dashboard/icons";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { useTableControls } from "@/modules/dashboard/hooks/useTableControls";
import { PanelToolbar } from "@/modules/dashboard/components/PanelToolbar";
import { StatsCards } from "@/modules/dashboard/components/StatsCards";
import { SearchAndFilterBar } from "@/modules/dashboard/components/SearchAndFilterBar";
import { SortableTh } from "@/modules/dashboard/components/SortableTh";
import { SkeletonRows } from "@/modules/dashboard/components/SkeletonRows";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { EmptyState } from "@/modules/dashboard/components/EmptyState";
import { EditRolesModal } from "@/modules/users/components/EditRolesModal";

const ENDPOINT = "/api/admin/users";
const ROLE_FILTERS = [
  { value: "all", label: "All" },
  ...ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
];
const searchText = (u: UserWithRoles) => [u.fullName, u.email];

const ROLE_BADGE: Record<RoleId, string> = {
  admin: "bg-[#c0a84f]/15 text-[#8a742f]",
  developer: "bg-gray-100 text-gray-700",
  teacher: "bg-purple-50 text-purple-700",
  student: "bg-blue-50 text-blue-700",
};

function Avatar({ user }: { user: UserWithRoles }) {
  const name = user.fullName ?? user.email ?? "?";
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatarUrl}
      alt={name}
      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
      <span className="text-accent font-bold text-xs">
        {name[0]?.toUpperCase()}
      </span>
    </div>
  );
}

export function UsersPanel({
  canManage,
  currentUserId,
}: {
  canManage: boolean;
  currentUserId: string;
}) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const { rows, setRows, loading, refreshing, refresh } =
    useAdminRecords<UserWithRoles>(ENDPOINT, handleError);

  // Role filter is applied before search/sort (users have roles, not a status)
  const [roleFilter, setRoleFilter] = useState("all");
  const byRole = useMemo(
    () =>
      roleFilter === "all"
        ? rows
        : rows.filter((u) => u.roles.includes(roleFilter as RoleId)),
    [rows, roleFilter],
  );
  const table = useTableControls(byRole, searchText);

  const [editing, setEditing] = useState<UserWithRoles | null>(null);

  const handleSaved = (saved: UserWithRoles) => {
    setRows((prev) => prev.map((u) => (u._id === saved._id ? saved : u)));
    setEditing(null);
    showToast("Roles updated");
  };

  const countWith = (role: RoleId) =>
    rows.filter((u) => u.roles.includes(role)).length;

  return (
    <>
      <ToastContainer toasts={toasts} />

      {editing && (
        <EditRolesModal
          user={editing}
          isSelf={editing._id === currentUserId}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      <PanelToolbar
        summary={`${rows.length} user${rows.length !== 1 ? "s" : ""}`}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <StatsCards
        loading={loading}
        cards={[
          {
            label: "Total Users",
            value: rows.length,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            icon: <StatIcon name="users" />,
          },
          {
            label: "Teachers",
            value: countWith("teacher"),
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            icon: <StatIcon name="academicCap" />,
          },
          {
            label: "Students",
            value: countWith("student"),
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            icon: <StatIcon name="bookOpen" />,
          },
        ]}
      />

      {!loading && (
        <SearchAndFilterBar
          query={table.query}
          onQueryChange={table.setQuery}
          activeFilter={roleFilter}
          onFilterChange={setRoleFilter}
          filterOptions={ROLE_FILTERS}
          resultCount={table.filtered.length}
          placeholder="Search by name or email…"
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
        {!loading && table.filtered.length === 0 ? (
          <EmptyState
            label={
              table.query || roleFilter !== "all"
                ? "No results match your filters"
                : "No users yet"
            }
            icon={<StatIcon name="users" className="w-full h-full" />}
          />
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-380px)] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
                <tr>
                  <SortableTh
                    label="User"
                    sortKey="fullName"
                    currentSortKey={table.sortKey}
                    currentSortDir={table.sortDir}
                    onSort={table.handleSort}
                  />
                  <th className={thClass}>Roles</th>
                  <SortableTh
                    label="Joined"
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
                  <SkeletonRows cols={canManage ? 4 : 3} />
                ) : (
                  table.filtered.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className={tdClass}>
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar user={u} />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {u.fullName ?? "—"}
                              {u._id === currentUserId && (
                                <span className="ml-2 text-xs font-normal text-gray-400">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <div className="flex flex-wrap gap-1.5">
                          {u.roles.length === 0 ? (
                            <span className="text-xs text-gray-400">
                              No role
                            </span>
                          ) : (
                            u.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[role]}`}
                              >
                                {ROLE_LABELS[role]}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td
                        className={`${tdClass} text-gray-500 whitespace-nowrap`}
                      >
                        {formatDate(u.createdAt)}
                      </td>
                      {canManage && (
                        <td className={tdClass}>
                          <button
                            onClick={() => setEditing(u)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
                          >
                            Edit roles
                          </button>
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
