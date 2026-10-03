"use client";

import { useCallback, useMemo, useState } from "react";
import { ROLES, ROLE_LABELS, type RoleId } from "@/modules/auth/permissions";
import type { UserWithRoles } from "@/modules/users/types";
import { formatDate } from "@/modules/dashboard/format";
import { useToasts } from "@/modules/dashboard/hooks/useToasts";
import { useAdminRecords } from "@/modules/dashboard/hooks/useAdminRecords";
import { PageHeader } from "@/modules/dashboard/components/PageHeader";
import {
  StatusPill,
  type PillTone,
} from "@/modules/dashboard/components/StatusPill";
import { ToastContainer } from "@/modules/dashboard/components/ToastContainer";
import { ListView } from "@/modules/dashboard/list/ListView";
import { useListView } from "@/modules/dashboard/list/useListView";
import type { ListColumn, ListFilter } from "@/modules/dashboard/list/types";
import { EditRolesModal } from "@/modules/users/components/EditRolesModal";

const ENDPOINT = "/api/admin/users";

const ROLE_TONE: Record<RoleId, PillTone> = {
  admin: "yellow",
  developer: "gray",
  teacher: "purple",
  student: "blue",
};

function Avatar({ user }: { user: UserWithRoles }) {
  const name = user.fullName ?? user.email ?? "?";
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatarUrl}
      alt={name}
      className="size-6 shrink-0 rounded-full object-cover"
    />
  ) : (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
      <span className="text-[10px] font-bold text-accent">
        {name[0]?.toUpperCase()}
      </span>
    </div>
  );
}

const FILTERS: ListFilter<UserWithRoles>[] = [
  { id: "name", type: "text", label: "Name", value: (u) => u.fullName },
  { id: "email", type: "text", label: "Email", value: (u) => u.email },
  {
    id: "role",
    type: "select",
    label: "Role",
    options: ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] })),
    value: (u) => u.roles,
  },
];

const getId = (u: UserWithRoles) => u._id;

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

  const [editing, setEditing] = useState<UserWithRoles | null>(null);

  const handleSaved = (saved: UserWithRoles) => {
    setRows((prev) => prev.map((u) => (u._id === saved._id ? saved : u)));
    setEditing(null);
    showToast("Roles updated");
  };

  const columns = useMemo<ListColumn<UserWithRoles>[]>(
    () => [
      {
        id: "user",
        header: "User",
        hideable: false,
        sortValue: (u) => (u.fullName ?? u.email ?? "").toLowerCase(),
        cell: (u) => (
          <span className="flex items-center gap-2">
            <Avatar user={u} />
            <span className="font-medium text-gray-900">
              {u.fullName ?? "—"}
            </span>
            {u._id === currentUserId && (
              <span className="text-xs text-gray-400">(you)</span>
            )}
          </span>
        ),
      },
      {
        id: "email",
        header: "Email",
        sortValue: (u) => u.email?.toLowerCase(),
        cell: (u) => <span className="text-gray-600">{u.email ?? "—"}</span>,
      },
      {
        id: "roles",
        header: "Roles",
        sortValue: (u) =>
          Math.min(...u.roles.map((r) => ROLES.indexOf(r)), ROLES.length),
        cell: (u) =>
          u.roles.length === 0 ? (
            <span className="text-xs text-gray-400">No role</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {u.roles.map((role) => (
                <StatusPill key={role} tone={ROLE_TONE[role]}>
                  {ROLE_LABELS[role]}
                </StatusPill>
              ))}
            </span>
          ),
      },
      {
        id: "joined",
        header: "Joined",
        sortValue: (u) => u.createdAt,
        cell: (u) => (
          <span className="text-gray-600">{formatDate(u.createdAt)}</span>
        ),
      },
    ],
    [currentUserId],
  );

  const list = useListView({
    listId: "users",
    rows,
    columns,
    filters: FILTERS,
    defaultSort: { id: "joined", direction: "desc" },
    getRowId: getId,
  });

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

      <PageHeader
        title="Users & Roles"
        onRefresh={refresh}
        refreshing={refreshing}
      />

      <ListView
        list={list}
        columns={columns}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={canManage ? setEditing : undefined}
        timestamp={(u) => u.createdAt}
        loading={loading}
        emptyMessage="No users yet"
      />
    </>
  );
}
