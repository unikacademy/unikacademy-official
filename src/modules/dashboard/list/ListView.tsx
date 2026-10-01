"use client";

import { useState } from "react";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  FilterIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatRelativeShort } from "@/modules/dashboard/format";
import { ConfirmDialog } from "@/modules/dashboard/components/ConfirmDialog";
import {
  PAGE_SIZES,
  type ListBulkAction,
  type ListColumn,
  type ListFilter,
} from "@/modules/dashboard/list/types";
import type { ListViewState } from "@/modules/dashboard/list/useListView";

// Grey, borderless inline filter inputs (ERPNext "standard filters")
const filterInputClass =
  "h-7 w-36 rounded-md border-0 bg-muted/70 px-2 text-[13px] shadow-none placeholder:text-muted-foreground/80 focus-visible:bg-background focus-visible:ring-1";

function FilterBar<T>({
  filters,
  list,
}: {
  filters: ListFilter<T>[];
  list: ListViewState<T>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) =>
        f.type === "select" ? (
          <NativeSelect
            key={f.id}
            size="sm"
            aria-label={f.label}
            value={list.filterValues[f.id] ?? ""}
            onChange={(e) => list.setFilter(f.id, e.target.value)}
            className="w-36 [&_select]:border-0 [&_select]:bg-muted/70 [&_select]:text-[13px]"
          >
            <NativeSelectOption value="">{f.label}</NativeSelectOption>
            {f.options.map((o) => (
              <NativeSelectOption key={o.value} value={o.value}>
                {o.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ) : (
          <Input
            key={f.id}
            aria-label={f.label}
            placeholder={f.label}
            value={list.filterValues[f.id] ?? ""}
            onChange={(e) => list.setFilter(f.id, e.target.value)}
            className={filterInputClass}
          />
        ),
      )}
    </div>
  );
}

// "Filter" button: lists the active filters, each removable on its own
function FilterMenu<T>({
  filters,
  list,
}: {
  filters: ListFilter<T>[];
  list: ListViewState<T>;
}) {
  const active = filters.filter((f) => list.filterValues[f.id]);
  const label = (f: ListFilter<T>) => {
    const raw = list.filterValues[f.id];
    return f.type === "select"
      ? (f.options.find((o) => o.value === raw)?.label ?? raw)
      : `contains "${raw}"`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("font-normal", active.length > 0 && "rounded-r-none")}
          />
        }
      >
        <FilterIcon />
        {active.length > 0
          ? `${active.length} filter${active.length > 1 ? "s" : ""}`
          : "Filter"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {active.length === 0 ? (
          <DropdownMenuLabel className="font-normal">
            No filters applied — use the boxes on the left.
          </DropdownMenuLabel>
        ) : (
          <>
            <DropdownMenuLabel>Active filters</DropdownMenuLabel>
            {active.map((f) => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => list.setFilter(f.id, "")}
                title="Remove this filter"
              >
                <span className="flex-1 truncate">
                  <span className="text-muted-foreground">{f.label}:</span>{" "}
                  {label(f)}
                </span>
                <XIcon className="text-muted-foreground" />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={list.clearFilters}>
              Clear all filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortControl<T>({ list }: { list: ListViewState<T> }) {
  const current = list.sortables.find((s) => s.id === list.sort.id);
  const asc = list.sort.direction === "asc";
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-r-none"
        aria-label={asc ? "Sorted ascending" : "Sorted descending"}
        title={asc ? "Ascending" : "Descending"}
        onClick={() =>
          list.setSort({ id: list.sort.id, direction: asc ? "desc" : "asc" })
        }
      >
        {asc ? <ArrowUpNarrowWideIcon /> : <ArrowDownNarrowWideIcon />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="-ml-px rounded-l-none font-normal"
            />
          }
        >
          {current?.label ?? "Sort"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={list.sort.id}
            onValueChange={(id) =>
              list.setSort({ id: String(id), direction: list.sort.direction })
            }
          >
            {list.sortables.map((s) => (
              <DropdownMenuRadioItem key={s.id} value={s.id}>
                {s.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SettingsMenu<T>({
  columns,
  list,
}: {
  columns: ListColumn<T>[];
  list: ListViewState<T>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="List settings" />
        }
      >
        <Settings2Icon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        {columns
          .filter((c) => c.hideable !== false)
          .map((c) => (
            <DropdownMenuCheckboxItem
              key={c.id}
              checked={!list.hiddenColumns.includes(c.id)}
              onCheckedChange={() => list.toggleColumn(c.id)}
            >
              {c.header}
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={list.resetSettings}>
          Reset to default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BulkActions<T>({
  actions,
  list,
}: {
  actions: ListBulkAction<T>[];
  list: ListViewState<T>;
}) {
  const [pending, setPending] = useState<ListBulkAction<T> | null>(null);
  const count = list.selectedRows.length;

  const run = async (action: ListBulkAction<T>) => {
    await action.run(list.selectedRows);
    list.clearSelection();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-muted-foreground">
        {count} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="sm" />}>
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {actions.map((a) => (
            <DropdownMenuItem
              key={a.id}
              variant={a.destructive ? "destructive" : "default"}
              onClick={() => (a.confirm ? setPending(a) : void run(a))}
            >
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Clear selection"
        onClick={list.clearSelection}
      >
        <XIcon />
      </Button>

      {pending?.confirm && (
        <ConfirmDialog
          open
          title={pending.confirm.title}
          description={pending.confirm.description(count)}
          actionLabel={pending.confirm.actionLabel}
          destructive={pending.destructive}
          onConfirm={() => run(pending)}
          onOpenChange={(open) => !open && setPending(null)}
        />
      )}
    </div>
  );
}

/**
 * Shared ERPNext-style list: inline filters, Filter / Sort / ⚙ settings,
 * checkbox selection with bulk Actions, "N of M" count, relative time per
 * row, and 20 / 100 / 500 page sizes with "Load more".
 */
export function ListView<T>({
  list,
  columns,
  filters,
  getRowId,
  onRowClick,
  timestamp,
  bulkActions = [],
  loading = false,
  emptyMessage = "Nothing here yet",
  rowClassName,
}: {
  list: ListViewState<T>;
  columns: ListColumn<T>[];
  filters: ListFilter<T>[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Shown at the end of each row as "5 m", "3 d", … */
  timestamp?: (row: T) => string | null | undefined;
  bulkActions?: ListBulkAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: (row: T) => string | undefined;
}) {
  const selectable = bulkActions.length > 0;
  const cols = list.visibleColumns;
  const colSpan = cols.length + (selectable ? 1 : 0) + 1;

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      {/* Filters + controls */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b p-2.5">
        <FilterBar filters={filters} list={list} />
        <div className="flex items-center gap-2">
          {selectable && list.selectedRows.length > 0 ? (
            <BulkActions actions={bulkActions} list={list} />
          ) : (
            <>
              <div className="flex items-center">
                <FilterMenu filters={filters} list={list} />
                {list.activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="-ml-px rounded-l-none"
                    aria-label="Clear filters"
                    onClick={list.clearFilters}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
              {list.sortables.length > 0 && <SortControl list={list} />}
              <SettingsMenu columns={columns} list={list} />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <Table className="text-[13px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {selectable && (
              <TableHead className="w-9 pl-3">
                <Checkbox
                  aria-label="Select all"
                  checked={list.allVisibleSelected}
                  onCheckedChange={list.toggleAllVisible}
                  disabled={list.visibleRows.length === 0}
                />
              </TableHead>
            )}
            {cols.map((c) => (
              <TableHead
                key={c.id}
                className={cn(
                  "h-9 text-xs font-normal text-muted-foreground",
                  c.align === "right" && "text-right",
                  c.className,
                )}
              >
                {c.header}
              </TableHead>
            ))}
            <TableHead className="h-9 pr-3 text-right text-xs font-normal text-muted-foreground">
              {loading ? "" : `${list.visibleRows.length} of ${list.total}`}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="px-3 py-2.5">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : list.visibleRows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={colSpan}
                className="py-16 text-center text-muted-foreground"
              >
                {list.activeFilterCount > 0
                  ? "No results match your filters"
                  : emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            list.visibleRows.map((row) => {
              const selected = list.isSelected(row);
              const ts = timestamp?.(row);
              return (
                <TableRow
                  key={getRowId(row)}
                  data-state={selected ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "h-10",
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row),
                  )}
                >
                  {selectable && (
                    <TableCell
                      className="w-9 pl-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        aria-label="Select row"
                        checked={selected}
                        onCheckedChange={() => list.toggleRow(row)}
                      />
                    </TableCell>
                  )}
                  {cols.map((c) => (
                    <TableCell
                      key={c.id}
                      className={cn(
                        c.align === "right" && "text-right",
                        c.className,
                      )}
                    >
                      {c.cell(row)}
                    </TableCell>
                  ))}
                  <TableCell className="pr-3 text-right text-xs text-muted-foreground">
                    {ts ? formatRelativeShort(ts) : ""}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Paging */}
      {!loading && list.total > 0 && (
        <div className="flex items-center justify-between gap-2 border-t p-2.5">
          <div className="flex items-center">
            {PAGE_SIZES.map((size, i) => (
              <Button
                key={size}
                variant={list.pageSize === size ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "font-normal",
                  i > 0 && "-ml-px",
                  i === 0 && "rounded-r-none",
                  i === PAGE_SIZES.length - 1 && "rounded-l-none",
                  i > 0 && i < PAGE_SIZES.length - 1 && "rounded-none",
                )}
                onClick={() => list.setPageSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          {list.hasMore && (
            <Button variant="outline" size="sm" onClick={list.loadMore}>
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
