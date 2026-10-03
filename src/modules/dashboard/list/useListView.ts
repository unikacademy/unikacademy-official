"use client";

import { useMemo, useState } from "react";
import type {
  ListColumn,
  ListFilter,
  ListSort,
  ListSortOption,
  PageSize,
  SortValue,
} from "@/modules/dashboard/list/types";
import { useListSettings } from "@/modules/dashboard/list/useListSettings";

function compare(a: SortValue, b: SortValue) {
  // Empty values always sort last
  const aEmpty = a === null || a === undefined || a === "";
  const bEmpty = b === null || b === undefined || b === "";
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function matches<T>(row: T, filter: ListFilter<T>, raw: string) {
  const query = raw.trim().toLowerCase();
  if (!query) return true;
  if (filter.type === "select") {
    const value = filter.value(row);
    return Array.isArray(value) ? value.includes(raw) : (value ?? "") === raw;
  }
  const value = filter.value(row);
  const values = Array.isArray(value) ? value : [value];
  return values.some((v) => (v ?? "").toLowerCase().includes(query));
}

/**
 * State + derived rows for ListView: filters, sort, column visibility,
 * page size / "load more", and row selection. Sort, page size and hidden
 * columns are remembered per `listId`.
 */
export function useListView<T>({
  listId,
  rows,
  columns,
  filters,
  sortOptions = [],
  defaultSort,
  getRowId,
}: {
  listId: string;
  rows: T[];
  columns: ListColumn<T>[];
  filters: ListFilter<T>[];
  sortOptions?: ListSortOption<T>[];
  defaultSort: ListSort;
  getRowId: (row: T) => string;
}) {
  const { settings, update, reset } = useListSettings(listId, {
    hiddenColumns: columns.filter((c) => c.defaultHidden).map((c) => c.id),
    pageSize: 20,
    sort: defaultSort,
  });

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState<number | null>(null); // null = pageSize
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sort = settings.sort ?? defaultSort;
  const pageSize = settings.pageSize;
  const shownLimit = limit ?? pageSize;

  // Everything the Sort menu can sort by
  const sortables = useMemo(
    () => [
      ...sortOptions.map((o) => ({ id: o.id, label: o.label, value: o.value })),
      ...columns
        .filter((c) => c.sortValue)
        .map((c) => ({ id: c.id, label: c.header, value: c.sortValue! })),
    ],
    [sortOptions, columns],
  );

  const filtered = useMemo(() => {
    const active = filters.filter((f) => (filterValues[f.id] ?? "") !== "");
    const result = active.length
      ? rows.filter((r) =>
          active.every((f) => matches(r, f, filterValues[f.id])),
        )
      : rows;

    const by = sortables.find((s) => s.id === sort.id);
    if (!by) return result;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...result].sort((a, b) => dir * compare(by.value(a), by.value(b)));
  }, [rows, filters, filterValues, sortables, sort]);

  const visibleRows = filtered.slice(0, shownLimit);
  const visibleColumns = columns.filter(
    (c) => !settings.hiddenColumns.includes(c.id),
  );
  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  // Selection only ever refers to rows that still exist
  const selectedRows = rows.filter((r) => selected.has(getRowId(r)));
  const allVisibleSelected =
    visibleRows.length > 0 &&
    visibleRows.every((r) => selected.has(getRowId(r)));

  return {
    // data
    filtered,
    visibleRows,
    visibleColumns,
    total: filtered.length,
    hasMore: filtered.length > visibleRows.length,
    // filters
    filterValues,
    activeFilterCount,
    setFilter: (id: string, value: string) => {
      setFilterValues((prev) => ({ ...prev, [id]: value }));
      setLimit(null);
    },
    clearFilters: () => {
      setFilterValues({});
      setLimit(null);
    },
    // sort
    sort,
    sortables,
    setSort: (next: ListSort) => update({ sort: next }),
    // paging
    pageSize,
    setPageSize: (size: PageSize) => {
      update({ pageSize: size });
      setLimit(null);
    },
    loadMore: () => setLimit(shownLimit + pageSize),
    // columns
    hiddenColumns: settings.hiddenColumns,
    toggleColumn: (id: string) =>
      update({
        hiddenColumns: settings.hiddenColumns.includes(id)
          ? settings.hiddenColumns.filter((c) => c !== id)
          : [...settings.hiddenColumns, id],
      }),
    resetSettings: reset,
    // selection
    selectedRows,
    isSelected: (row: T) => selected.has(getRowId(row)),
    toggleRow: (row: T) =>
      setSelected((prev) => {
        const next = new Set(prev);
        const id = getRowId(row);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    allVisibleSelected,
    toggleAllVisible: () =>
      setSelected((prev) => {
        const next = new Set(prev);
        const ids = visibleRows.map(getRowId);
        if (ids.every((id) => next.has(id)))
          ids.forEach((id) => next.delete(id));
        else ids.forEach((id) => next.add(id));
        return next;
      }),
    clearSelection: () => setSelected(new Set()),
  };
}

export type ListViewState<T> = ReturnType<typeof useListView<T>>;
