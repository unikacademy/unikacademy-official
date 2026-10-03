"use client";

import { useCallback, useMemo, useState } from "react";
import { COURSE_CATEGORIES, type Course } from "@/modules/courses/types";
import { CourseFormModal } from "@/modules/courses/components/CourseFormModal";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/modules/dashboard/format";
import {
  bulkResultMessage,
  deleteEach,
  patchEach,
} from "@/modules/dashboard/bulk";
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
import type {
  ListBulkAction,
  ListColumn,
  ListFilter,
  ListSortOption,
} from "@/modules/dashboard/list/types";

const ENDPOINT = "/api/admin/courses";

const CATEGORY_ORDER: Course["category"][] = ["core", "pricing", "premium"];
const CATEGORY_TONE: Record<Course["category"], PillTone> = {
  core: "blue",
  pricing: "purple",
  premium: "yellow",
};
const categoryLabel = (c: Course["category"]) =>
  COURSE_CATEGORIES.find((x) => x.value === c)?.label ?? c;

const FILTERS: ListFilter<Course>[] = [
  { id: "title", type: "text", label: "Title", value: (c) => c.title },
  {
    id: "category",
    type: "select",
    label: "Category",
    options: COURSE_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
    value: (c) => c.category,
  },
  {
    id: "live",
    type: "select",
    label: "Visibility",
    options: [
      { value: "live", label: "Live" },
      { value: "hidden", label: "Hidden" },
    ],
    value: (c) => (c.isActive ? "live" : "hidden"),
  },
];

// Same order the website uses: category, then display order
const SORT_OPTIONS: ListSortOption<Course>[] = [
  {
    id: "display",
    label: "Display order",
    value: (c) => CATEGORY_ORDER.indexOf(c.category) * 100000 + c.order,
  },
];

const getId = (c: Course) => c._id;

export function CoursesPanel({ canManage }: { canManage: boolean }) {
  const { toasts, showToast } = useToasts();
  const handleError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );
  const {
    rows: courses,
    setRows,
    loading,
    refreshing,
    refresh,
    patchLocal,
    remove,
  } = useAdminRecords<Course>(ENDPOINT, handleError);

  // null = closed; { course: null } = create; { course } = edit
  const [form, setForm] = useState<{ course: Course | null } | null>(null);

  const handleSaved = (saved: Course, created: boolean) => {
    setRows((prev) =>
      created
        ? [saved, ...prev]
        : prev.map((c) => (c._id === saved._id ? saved : c)),
    );
    showToast(created ? "Course created" : "Course updated");
    setForm(null);
  };

  const toggleActive = useCallback(
    async (course: Course) => {
      const res = await fetch(`${ENDPOINT}/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !course.isActive }),
      }).catch(() => null);
      if (res?.ok) {
        patchLocal(course._id, { isActive: !course.isActive });
        showToast(
          course.isActive
            ? "Course hidden from website"
            : "Course published to website",
        );
      } else {
        showToast("Failed to update course", "error");
      }
    },
    [patchLocal, showToast],
  );

  const columns = useMemo<ListColumn<Course>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        hideable: false,
        sortValue: (c) => c.title.toLowerCase(),
        cell: (c) => (
          <span className="font-medium text-gray-900">{c.title}</span>
        ),
      },
      {
        id: "category",
        header: "Category",
        sortValue: (c) => CATEGORY_ORDER.indexOf(c.category),
        cell: (c) => (
          <StatusPill tone={CATEGORY_TONE[c.category]}>
            {categoryLabel(c.category)}
          </StatusPill>
        ),
      },
      {
        id: "live",
        header: "Website",
        sortValue: (c) => (c.isActive ? 0 : 1),
        cell: (c) =>
          canManage ? (
            <span
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch
                size="sm"
                checked={c.isActive}
                onCheckedChange={() => void toggleActive(c)}
                aria-label={
                  c.isActive ? "Hide from website" : "Publish to website"
                }
              />
              <span className="text-xs text-gray-500">
                {c.isActive ? "Live" : "Hidden"}
              </span>
            </span>
          ) : (
            <StatusPill tone={c.isActive ? "green" : "gray"}>
              {c.isActive ? "Live" : "Hidden"}
            </StatusPill>
          ),
      },
      {
        id: "price",
        header: "Price",
        align: "right",
        sortValue: (c) => Number(c.price.replace(/[^\d.]/g, "")) || null,
        cell: (c) =>
          c.price ? (
            <span className="font-medium text-gray-900">₹{c.price}</span>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        id: "featured",
        header: "Most Popular",
        sortValue: (c) => (c.featured ? 0 : 1),
        cell: (c) =>
          c.featured ? (
            <StatusPill tone="orange">Most Popular</StatusPill>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        id: "order",
        header: "Order",
        align: "right",
        sortValue: (c) => c.order,
        cell: (c) => <span className="text-gray-600">{c.order}</span>,
      },
      {
        id: "features",
        header: "Features",
        className: "max-w-[280px]",
        cell: (c) => (
          <span className="block truncate text-gray-500">
            {c.features.length
              ? `${c.features[0]}${c.features.length > 1 ? ` (+${c.features.length - 1} more)` : ""}`
              : "—"}
          </span>
        ),
      },
      {
        id: "description",
        header: "Description",
        defaultHidden: true,
        className: "max-w-[320px]",
        cell: (c) => (
          <span className="block truncate text-gray-500">{c.description}</span>
        ),
      },
      {
        id: "created",
        header: "Created",
        defaultHidden: true,
        sortValue: (c) => c.createdAt,
        cell: (c) => (
          <span className="text-gray-600">{formatDate(c.createdAt)}</span>
        ),
      },
    ],
    [canManage, toggleActive],
  );

  const list = useListView({
    listId: "courses",
    rows: courses,
    columns,
    filters: FILTERS,
    sortOptions: SORT_OPTIONS,
    defaultSort: { id: "display", direction: "asc" },
    getRowId: getId,
  });

  const report = (r: { text: string; ok: boolean }) =>
    showToast(r.text, r.ok ? "success" : "error");

  const setVisibility = async (selected: Course[], isActive: boolean) => {
    const failed = await patchEach(ENDPOINT, selected, { isActive }, (c) =>
      patchLocal(c._id, { isActive }),
    );
    report(
      bulkResultMessage(
        isActive ? "Published" : "Hid",
        "course",
        selected.length,
        failed,
      ),
    );
  };

  const bulkActions: ListBulkAction<Course>[] = canManage
    ? [
        {
          id: "publish",
          label: "Publish to website",
          run: (s) => setVisibility(s, true),
        },
        {
          id: "hide",
          label: "Hide from website",
          run: (s) => setVisibility(s, false),
        },
        {
          id: "delete",
          label: "Delete",
          destructive: true,
          confirm: {
            title: "Delete courses?",
            description: (n) =>
              `This permanently deletes ${n} course${n > 1 ? "s" : ""}. Prices shown on the website for ${n > 1 ? "them" : "it"} fall back to the defaults.`,
            actionLabel: "Delete",
          },
          run: async (selected) => {
            const failed = await deleteEach(selected, remove);
            report(
              bulkResultMessage("Deleted", "course", selected.length, failed),
            );
          },
        },
      ]
    : [];

  return (
    <>
      <ToastContainer toasts={toasts} />

      {form && (
        <CourseFormModal
          course={form.course}
          onClose={() => setForm(null)}
          onSaved={handleSaved}
          onError={handleError}
        />
      )}

      <PageHeader
        title="Courses"
        onRefresh={refresh}
        refreshing={refreshing}
        primaryAction={
          canManage
            ? { label: "Add Course", onClick: () => setForm({ course: null }) }
            : undefined
        }
      />

      <ListView
        list={list}
        columns={columns}
        filters={FILTERS}
        getRowId={getId}
        onRowClick={canManage ? (course) => setForm({ course }) : undefined}
        timestamp={(c) => c.createdAt}
        bulkActions={bulkActions}
        loading={loading}
        emptyMessage="No courses yet"
      />
    </>
  );
}
