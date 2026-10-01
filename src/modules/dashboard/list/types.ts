import type { ReactNode } from "react";

// Configuration for the shared ERPNext-style list (ListView). Pages describe
// their columns / filters / sorts / bulk actions; the list does the rest, so
// a new capability added to ListView shows up on every page.

export type SortValue = string | number | null | undefined;

export interface ListColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Makes the column sortable (appears in the Sort menu) */
  sortValue?: (row: T) => SortValue;
  align?: "left" | "right";
  /** Extra classes for the header + cells (e.g. widths) */
  className?: string;
  /** Can be hidden from ⚙ Settings (default true) */
  hideable?: boolean;
  /** Hidden until the user enables it in ⚙ Settings */
  defaultHidden?: boolean;
}

/** A sort that isn't tied to a visible column, e.g. "Created On" */
export interface ListSortOption<T> {
  id: string;
  label: string;
  value: (row: T) => SortValue;
}

export type ListFilter<T> =
  | {
      id: string;
      type: "text";
      label: string;
      /** Value(s) matched case-insensitively with "contains" */
      value: (
        row: T,
      ) => string | null | undefined | (string | null | undefined)[];
    }
  | {
      id: string;
      type: "select";
      label: string;
      options: { value: string; label: string }[];
      value: (row: T) => string | null | undefined;
    };

export interface ListBulkAction<T> {
  id: string;
  label: string;
  destructive?: boolean;
  /** Ask for confirmation first */
  confirm?: {
    title: string;
    description: (count: number) => string;
    actionLabel: string;
  };
  run: (rows: T[]) => Promise<void> | void;
}

export type SortDirection = "asc" | "desc";

export interface ListSort {
  id: string; // column id or sort option id
  direction: SortDirection;
}

export const PAGE_SIZES = [20, 100, 500] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

/** Per-list user settings, remembered in the browser */
export interface ListSettings {
  hiddenColumns: string[];
  pageSize: PageSize;
  sort: ListSort | null;
}
