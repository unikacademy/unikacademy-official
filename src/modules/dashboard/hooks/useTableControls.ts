"use client";

import { useMemo, useState } from "react";
import type { SortDir } from "@/modules/dashboard/types";

/**
 * Search + status filter + column sort for a dashboard table.
 * `searchText(row)` returns the strings the search box should match against.
 */
export function useTableControls<T extends object>(
  rows: T[],
  searchText: (row: T) => (string | undefined | null)[],
) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Same column again flips direction; a new column starts ascending
  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = rows;
    if (statusFilter !== "all")
      result = result.filter(
        (r) => (r as { status?: unknown }).status === statusFilter,
      );

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((r) =>
        searchText(r).some((s) => (s ?? "").toLowerCase().includes(q)),
      );
    }

    return [...result].sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [rows, statusFilter, query, sortKey, sortDir, searchText]);

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDir,
    handleSort,
    filtered,
    isFiltering: query !== "" || statusFilter !== "all",
  };
}
