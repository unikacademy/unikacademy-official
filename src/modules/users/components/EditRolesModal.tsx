"use client";

import { useState } from "react";
import { ROLES, ROLE_LABELS, type RoleId } from "@/modules/auth/permissions";
import type { UserWithRoles } from "@/modules/users/types";

const ROLE_HINTS: Record<RoleId, string> = {
  admin: "Full access — can view and change everything, including roles",
  developer: "Can view everything an admin sees, but can't change anything",
  teacher: "Their classes and assigned demo sessions (coming in phase 3)",
  student: "Their upcoming classes (default for new signups)",
};

export function EditRolesModal({
  user,
  isSelf,
  onClose,
  onSaved,
}: {
  user: UserWithRoles;
  isSelf: boolean;
  onClose: () => void;
  onSaved: (user: UserWithRoles) => void;
}) {
  const [selected, setSelected] = useState<RoleId[]>(user.roles);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mirrors the server rule so the admin can't lock themselves out
  const lockOwnAdmin = isSelf && user.roles.includes("admin");

  const toggle = (role: RoleId) =>
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selected }),
      });
      const data = await res.json();
      if (res.ok) onSaved(data as UserWithRoles);
      else setError(data.error ?? "Failed to update roles");
    } catch {
      setError("Failed to update roles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-primary">Edit roles</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {user.fullName ?? user.email}
            {user.fullName && user.email ? ` · ${user.email}` : ""}
          </p>
        </div>

        <div className="px-6 py-4 space-y-2">
          {ROLES.map((role) => {
            const checked = selected.includes(role);
            const disabled = role === "admin" && lockOwnAdmin;
            return (
              <label
                key={role}
                className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                  checked
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-primary"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(role)}
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    {ROLE_LABELS[role]}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {disabled
                      ? "You can't remove your own admin role"
                      : ROLE_HINTS[role]}
                  </span>
                </span>
              </label>
            );
          })}
          {selected.length === 0 && (
            <p className="text-xs text-amber-600">
              With no roles, this user will only see the Overview page.
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save roles"}
          </button>
        </div>
      </div>
    </div>
  );
}
