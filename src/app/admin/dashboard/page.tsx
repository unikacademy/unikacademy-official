"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

type ContactStatus = "not_read" | "read" | "replied";
type AppStatus = "not_read" | "read" | "shortlisted" | "rejected";
type ActiveSection =
  | "contacts"
  | "demo-bookings"
  | "applications"
  | "jobs"
  | "courses";
type SortDir = "asc" | "desc";

interface Job {
  _id: string;
  title: string;
  type: string;
  workMode: string;
  responsibilities: string[];
  eligibility: string[];
  isActive: boolean;
  createdAt: string;
}

const JOB_TYPES = ["Internship", "Full-time", "Part-time", "Contract"];
const JOB_WORKMODES = ["Work From Home", "On-site", "Hybrid"];

interface Course {
  _id: string;
  title: string;
  description: string;
  category: "core" | "pricing" | "premium";
  iconKey: string;
  price: string;
  features: string[];
  featured: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const COURSE_CATEGORIES = [
  {
    value: "core",
    label: "Core Course",
    hint: 'Shown in the "Our Core Courses" grid on the homepage',
  },
  {
    value: "pricing",
    label: "Pricing Plan",
    hint: 'Shown in the "Beginner-Friendly Pricing" section',
  },
  {
    value: "premium",
    label: "Premium Plan",
    hint: 'Shown in the "Pick Your Session Format" section',
  },
];

const ICON_OPTIONS = [
  { key: "chat", label: "Chat / Communication" },
  { key: "briefcase", label: "Business" },
  { key: "microphone", label: "Public Speaking" },
  { key: "book", label: "Language / English" },
  { key: "star", label: "Personality" },
  { key: "lightning", label: "Basic / Beginner" },
  { key: "chart", label: "Intermediate / Progress" },
  { key: "trophy", label: "Advanced / Achievement" },
  { key: "default", label: "Generic" },
];

const EMPTY_COURSE_FORM = {
  title: "",
  description: "",
  category: "core" as Course["category"],
  iconKey: "default",
  price: "",
  features: [""],
  featured: false,
  order: 0,
  isActive: true,
};

const EMPTY_JOB_FORM = {
  title: "",
  type: "Internship",
  workMode: "Work From Home",
  responsibilities: [""],
  eligibility: [""],
  isActive: true,
};

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

interface DemoBooking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  status: ContactStatus;
  createdAt: string;
}

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  status: AppStatus;
  createdAt: string;
}

type AnyRecord = Contact | DemoBooking | Application;

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CONTACT_STATUSES: {
  value: ContactStatus;
  label: string;
  color: string;
}[] = [
  { value: "not_read", label: "Not Read", color: "text-blue-500" },
  { value: "read", label: "Read", color: "text-gray-400" },
  { value: "replied", label: "Replied", color: "text-green-500" },
];

const APP_STATUSES: { value: AppStatus; label: string; color: string }[] = [
  { value: "not_read", label: "Not Read", color: "text-blue-500" },
  { value: "read", label: "Read", color: "text-gray-400" },
  { value: "shortlisted", label: "Shortlisted", color: "text-purple-500" },
  { value: "rejected", label: "Rejected", color: "text-red-500" },
];

const STATUS_STYLE: Record<string, string> = {
  not_read: "bg-blue-50 text-blue-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-50 text-green-700",
  shortlisted: "bg-purple-50 text-purple-700",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_DOT: Record<string, string> = {
  not_read: "bg-blue-500",
  read: "bg-gray-400",
  replied: "bg-green-500",
  shortlisted: "bg-purple-500",
  rejected: "bg-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  not_read: "Not Read",
  read: "Read",
  replied: "Replied",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

const FILTER_OPTIONS: Record<
  ActiveSection,
  { value: string; label: string }[]
> = {
  contacts: [{ value: "all", label: "All" }, ...CONTACT_STATUSES],
  "demo-bookings": [{ value: "all", label: "All" }, ...CONTACT_STATUSES],
  applications: [{ value: "all", label: "All" }, ...APP_STATUSES],
  jobs: [],
  courses: [],
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── StatsCards ──────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

function StatsCards({
  cards,
  loading,
}: {
  cards: StatCard[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bgColor}`}
          >
            <span className={card.textColor}>{card.icon}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary leading-tight">
              {card.value}
            </p>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SearchAndFilterBar ───────────────────────────────────────────────────────

function SearchAndFilterBar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  filterOptions,
  resultCount,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  activeFilter: string;
  onFilterChange: (v: string) => void;
  filterOptions: { value: string; label: string }[];
  resultCount: number;
}) {
  return (
    <div className="mb-4 space-y-3">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter chips + result count */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1 min-w-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === opt.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="flex-shrink-0 text-xs text-gray-400 font-medium whitespace-nowrap">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

// ─── SortableTh ───────────────────────────────────────────────────────────────

function SortableTh({
  label,
  sortKey,
  currentSortKey,
  currentSortDir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: string;
  currentSortKey: string;
  currentSortDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}) {
  const isActive = currentSortKey === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none group whitespace-nowrap ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span
          className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
        >
          {isActive && currentSortDir === "asc" ? (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </span>
      </span>
    </th>
  );
}

// ─── SkeletonRows ─────────────────────────────────────────────────────────────

function SkeletonRows({ cols, rows = 7 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className={`h-4 rounded-full bg-gray-200 animate-pulse ${
                  j === 0
                    ? "w-28"
                    : j === cols - 1
                      ? "w-16"
                      : "w-full max-w-[120px]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── ToastContainer ───────────────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-slide-up flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            t.type === "success"
              ? "bg-gray-900 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.type === "success" ? (
            <svg
              className="w-4 h-4 text-green-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────

function ConfirmModal({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
          Delete Record
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ActionDropdown ───────────────────────────────────────────────────────────

function ActionDropdown({
  id,
  name,
  currentStatus,
  statuses,
  endpoint,
  onStatusChange,
  onDelete,
}: {
  id: string;
  name: string;
  currentStatus: string;
  statuses: { value: string; label: string; color: string }[];
  endpoint: string;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.right - 176 });
    }
    setOpen((o) => !o);
  };

  const handleStatus = async (e: React.MouseEvent, status: string) => {
    e.stopPropagation();
    setOpen(false);
    setLoading(status);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onStatusChange(id, status);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    onDelete(id, name);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer"
      >
        {loading ? (
          <svg
            className="animate-spin w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          "Actions"
        )}
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
          }}
          className="w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Set Status
          </p>
          {statuses.map((s) => {
            const isActive = currentStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={(e) => handleStatus(e, s.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition cursor-pointer ${
                  isActive ? "font-semibold text-primary" : "text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color.replace("text-", "bg-")}`}
                />
                {s.label}
                {isActive && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      )}
    </>
  );
}

// ─── SlideOver ────────────────────────────────────────────────────────────────

function SlideOver({
  item,
  section,
  onClose,
  onStatusChange,
  statuses,
}: {
  item: AnyRecord | null;
  section: ActiveSection;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  statuses: { value: string; label: string; color: string }[];
}) {
  const [updating, setUpdating] = useState(false);

  const endpointMap: Record<ActiveSection, string> = {
    contacts: "/api/admin/contacts",
    "demo-bookings": "/api/admin/demo-bookings",
    applications: "/api/admin/applications",
    jobs: "/api/admin/jobs",
    courses: "/api/admin/courses",
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!item || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`${endpointMap[section]}/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) onStatusChange(item._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  if (!item) return null;

  const contact = section === "contacts" ? (item as Contact) : null;
  const booking = section === "demo-bookings" ? (item as DemoBooking) : null;
  const application = section === "applications" ? (item as Application) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-primary">{item.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(item.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Status selector */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const isActive = item.status === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  disabled={updating || isActive}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:cursor-not-allowed ${
                    isActive
                      ? `${STATUS_STYLE[s.value]} ring-2 ring-offset-1 ring-current`
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s.value]}`}
                  />
                  {s.label}
                  {updating && isActive && (
                    <svg
                      className="animate-spin w-3 h-3 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <a
                href={`mailto:${item.email ?? ""}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-accent hover:underline break-all"
              >
                {(item as Contact).email ?? (item as DemoBooking).email ?? "—"}
              </a>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Phone
              </p>
              {(item as Contact).phone || (item as DemoBooking).phone ? (
                <a
                  href={`tel:${(item as Contact).phone ?? (item as DemoBooking).phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-gray-800 hover:text-accent transition"
                >
                  {(item as Contact).phone ?? (item as DemoBooking).phone}
                </a>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </div>
          </div>

          {/* Section-specific fields */}
          {booking && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Course Interested In
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {booking.course}
              </span>
            </div>
          )}
          {application && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Applied For
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {application.position}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${application.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-gray-800 hover:text-accent transition"
                >
                  {application.phone}
                </a>
              </div>
            </div>
          )}

          {/* Message */}
          {(contact?.message || booking?.message || application?.message) && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Message
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                {contact?.message ?? booking?.message ?? application?.message}
              </div>
            </div>
          )}
        </div>

        {/* Footer quick actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
          {((item as Contact).email || (item as DemoBooking).email) && (
            <a
              href={`mailto:${(item as Contact).email ?? (item as DemoBooking).email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </a>
          )}
          {((item as Contact).phone ||
            (item as DemoBooking).phone ||
            (item as Application).phone) && (
            <a
              href={`tel:${(item as Contact).phone ?? (item as DemoBooking).phone ?? (item as Application).phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-12 h-12 mb-3 opacity-40">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  // Data
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Job modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobForm, setJobForm] = useState(EMPTY_JOB_FORM);
  const [jobSaving, setJobSaving] = useState(false);

  // Course state
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM);
  const [courseSaving, setCourseSaving] = useState(false);

  // Navigation
  const [activeSection, setActiveSection] = useState<ActiveSection>("contacts");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search / filter / sort (reset on tab switch)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Slide-over
  const [detailItem, setDetailItem] = useState<AnyRecord | null>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: ActiveSection;
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = ++toastIdRef.current;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
    },
    [],
  );

  // Reset search/filter/sort on section switch
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortKey("createdAt");
    setSortDir("desc");
    setDetailItem(null);
  }, [activeSection]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      fetchAll();
    });
  }, [router]);

  const fetchAll = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const [cRes, dRes, aRes, jRes, crRes] = await Promise.all([
        fetch("/api/admin/contacts"),
        fetch("/api/admin/demo-bookings"),
        fetch("/api/admin/applications"),
        fetch("/api/admin/jobs"),
        fetch("/api/admin/courses"),
      ]);
      if (cRes.ok) setContacts(await cRes.json());
      if (dRes.ok) setDemoBookings(await dRes.json());
      if (aRes.ok) setApplications(await aRes.json());
      if (jRes.ok) setJobs(await jRes.json());
      if (crRes.ok) setCourses(await crRes.json());
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const updateStatus = useCallback(
    (type: ActiveSection, id: string, status: string) => {
      if (type === "contacts")
        setContacts((p) =>
          p.map((r) =>
            r._id === id ? { ...r, status: status as ContactStatus } : r,
          ),
        );
      if (type === "demo-bookings")
        setDemoBookings((p) =>
          p.map((r) =>
            r._id === id ? { ...r, status: status as ContactStatus } : r,
          ),
        );
      if (type === "applications")
        setApplications((p) =>
          p.map((r) =>
            r._id === id ? { ...r, status: status as AppStatus } : r,
          ),
        );
      // Keep slide-over in sync
      setDetailItem((prev) =>
        prev && prev._id === id ? ({ ...prev, status } as AnyRecord) : prev,
      );
      showToast("Status updated");
    },
    [showToast],
  );

  const requestDelete = (id: string, name: string, type: ActiveSection) =>
    setDeleteTarget({ id, name, type });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    const endpointMap: Record<ActiveSection, string> = {
      contacts: "/api/admin/contacts",
      "demo-bookings": "/api/admin/demo-bookings",
      applications: "/api/admin/applications",
      jobs: "/api/admin/jobs",
      courses: "/api/admin/courses",
    };
    const res = await fetch(`${endpointMap[type]}/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (type === "contacts")
        setContacts((p) => p.filter((r) => r._id !== id));
      if (type === "demo-bookings")
        setDemoBookings((p) => p.filter((r) => r._id !== id));
      if (type === "applications")
        setApplications((p) => p.filter((r) => r._id !== id));
      if (type === "jobs") setJobs((p) => p.filter((r) => r._id !== id));
      if (type === "courses") setCourses((p) => p.filter((r) => r._id !== id));
      if (detailItem?._id === id) setDetailItem(null);
      showToast("Record deleted");
    } else {
      showToast("Failed to delete record", "error");
    }
    setDeleteTarget(null);
  };

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return key;
      }
      setSortDir("asc");
      return key;
    });
  }, []);

  // ─── Filtered + sorted data ─────────────────────────────────────────────────

  const applyPipeline = useCallback(
    <T extends AnyRecord>(rows: T[]): T[] => {
      let result = rows;
      if (statusFilter !== "all")
        result = result.filter((r) => r.status === statusFilter);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter((r) => {
          const c = r as Contact;
          const d = r as DemoBooking;
          return (
            r.name.toLowerCase().includes(q) ||
            (c.email ?? d.email ?? "").toLowerCase().includes(q) ||
            (c.phone ?? d.phone ?? "").toLowerCase().includes(q)
          );
        });
      }
      return [...result].sort((a, b) => {
        const aVal = String(
          (a as unknown as Record<string, unknown>)[sortKey] ?? "",
        );
        const bVal = String(
          (b as unknown as Record<string, unknown>)[sortKey] ?? "",
        );
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    },
    [statusFilter, searchQuery, sortKey, sortDir],
  );

  const filteredContacts = useMemo(
    () => applyPipeline(contacts),
    [contacts, applyPipeline],
  );
  const filteredDemoBookings = useMemo(
    () => applyPipeline(demoBookings),
    [demoBookings, applyPipeline],
  );
  const filteredApplications = useMemo(
    () => applyPipeline(applications),
    [applications, applyPipeline],
  );

  const activeFilteredRows: AnyRecord[] =
    activeSection === "contacts"
      ? filteredContacts
      : activeSection === "demo-bookings"
        ? filteredDemoBookings
        : filteredApplications;

  // ─── Course helpers ──────────────────────────────────────────────────────────

  const openCreateCourse = () => {
    setEditingCourse(null);
    setCourseForm(EMPTY_COURSE_FORM);
    setCourseModalOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      iconKey: course.iconKey,
      price: course.price,
      features: course.features.length ? course.features : [""],
      featured: course.featured,
      order: course.order,
      isActive: course.isActive,
    });
    setCourseModalOpen(true);
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      showToast("Course title is required", "error");
      return;
    }
    if (!courseForm.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    setCourseSaving(true);
    try {
      const payload = {
        ...courseForm,
        features: courseForm.features.filter((f) => f.trim()),
      };
      const res = editingCourse
        ? await fetch(`/api/admin/courses/${editingCourse._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        const saved: Course = await res.json();
        if (editingCourse) {
          setCourses((p) => p.map((c) => (c._id === saved._id ? saved : c)));
          showToast("Course updated");
        } else {
          setCourses((p) => [saved, ...p]);
          showToast("Course created");
        }
        setCourseModalOpen(false);
      } else {
        showToast("Failed to save course", "error");
      }
    } finally {
      setCourseSaving(false);
    }
  };

  const toggleCourseActive = async (course: Course) => {
    const res = await fetch(`/api/admin/courses/${course._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !course.isActive }),
    });
    if (res.ok) {
      setCourses((p) =>
        p.map((c) =>
          c._id === course._id ? { ...c, isActive: !course.isActive } : c,
        ),
      );
      showToast(
        course.isActive
          ? "Course hidden from website"
          : "Course published to website",
      );
    } else {
      showToast("Failed to update course", "error");
    }
  };

  // ─── Job helpers ────────────────────────────────────────────────────────────

  const openCreateJob = () => {
    setEditingJob(null);
    setJobForm(EMPTY_JOB_FORM);
    setJobModalOpen(true);
  };

  const openEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      type: job.type,
      workMode: job.workMode,
      responsibilities: job.responsibilities.length
        ? job.responsibilities
        : [""],
      eligibility: job.eligibility.length ? job.eligibility : [""],
      isActive: job.isActive,
    });
    setJobModalOpen(true);
  };

  const saveJob = async () => {
    if (!jobForm.title.trim()) {
      showToast("Job title is required", "error");
      return;
    }
    setJobSaving(true);
    try {
      const payload = {
        ...jobForm,
        responsibilities: jobForm.responsibilities.filter((r) => r.trim()),
        eligibility: jobForm.eligibility.filter((e) => e.trim()),
      };
      const res = editingJob
        ? await fetch(`/api/admin/jobs/${editingJob._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        const saved: Job = await res.json();
        if (editingJob) {
          setJobs((p) => p.map((j) => (j._id === saved._id ? saved : j)));
          showToast("Job updated");
        } else {
          setJobs((p) => [saved, ...p]);
          showToast("Job created");
        }
        setJobModalOpen(false);
      } else {
        showToast("Failed to save job", "error");
      }
    } finally {
      setJobSaving(false);
    }
  };

  const toggleJobActive = async (job: Job) => {
    const res = await fetch(`/api/admin/jobs/${job._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !job.isActive }),
    });
    if (res.ok) {
      setJobs((p) =>
        p.map((j) =>
          j._id === job._id ? { ...j, isActive: !job.isActive } : j,
        ),
      );
      showToast(
        job.isActive ? "Job hidden from website" : "Job published to website",
      );
    } else {
      showToast("Failed to update job", "error");
    }
  };

  const deleteJob = async (job: Job) => {
    setDeleteTarget({ id: job._id, name: job.title, type: "jobs" });
  };

  // ─── Nav items ──────────────────────────────────────────────────────────────

  const navItems = [
    {
      key: "contacts" as ActiveSection,
      label: "Contact Messages",
      count: contacts.length,
      pending: contacts.filter((c) => c.status === "not_read").length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "demo-bookings" as ActiveSection,
      label: "Demo Bookings",
      count: demoBookings.length,
      pending: demoBookings.filter((d) => d.status === "not_read").length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "applications" as ActiveSection,
      label: "Job Applications",
      count: applications.length,
      pending: applications.filter((a) => a.status === "not_read").length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: "jobs" as ActiveSection,
      label: "Job Postings",
      count: jobs.length,
      pending: 0,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "courses" as ActiveSection,
      label: "Courses",
      count: courses.length,
      pending: 0,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
  ];

  const currentNav = navItems.find((n) => n.key === activeSection)!;

  // ─── Stats cards config ──────────────────────────────────────────────────────

  const statsCards: Record<ActiveSection, StatCard[]> = {
    courses: [
      {
        label: "Total Courses",
        value: courses.length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        ),
      },
      {
        label: "Active (Live)",
        value: courses.filter((c) => c.isActive).length,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        label: "Hidden",
        value: courses.filter((c) => !c.isActive).length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ),
      },
    ],
    jobs: [
      {
        label: "Total Postings",
        value: jobs.length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        label: "Active (Live)",
        value: jobs.filter((j) => j.isActive).length,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        label: "Hidden",
        value: jobs.filter((j) => !j.isActive).length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ),
      },
    ],
    contacts: [
      {
        label: "Total Messages",
        value: contacts.length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        label: "Unread",
        value: contacts.filter((c) => c.status === "not_read").length,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        ),
      },
      {
        label: "Replied",
        value: contacts.filter((c) => c.status === "replied").length,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
    "demo-bookings": [
      {
        label: "Total Bookings",
        value: demoBookings.length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        label: "Unread",
        value: demoBookings.filter((d) => d.status === "not_read").length,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        ),
      },
      {
        label: "Replied",
        value: demoBookings.filter((d) => d.status === "replied").length,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
    applications: [
      {
        label: "Total Applications",
        value: applications.length,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        label: "Unread",
        value: applications.filter((a) => a.status === "not_read").length,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        ),
      },
      {
        label: "Shortlisted",
        value: applications.filter((a) => a.status === "shortlisted").length,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ),
      },
    ],
  };

  // ─── Sidebar ─────────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-primary">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-lg">U</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              UNIK Academy
            </p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Management
        </p>
        {navItems.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white border-l-2 border-accent"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-accent" : ""}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.pending > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-blue-500 text-white">
                    {item.pending}
                  </span>
                )}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-accent text-primary" : "bg-white/10 text-white/60"}`}
                >
                  {item.count}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );

  // ─── Course Modal ────────────────────────────────────────────────────────────

  const CourseModal = () => {
    const updateFeature = (idx: number, val: string) =>
      setCourseForm((f) => {
        const arr = [...f.features];
        arr[idx] = val;
        return { ...f, features: arr };
      });
    const addFeature = () =>
      setCourseForm((f) => ({ ...f, features: [...f.features, ""] }));
    const removeFeature = (idx: number) =>
      setCourseForm((f) => ({
        ...f,
        features: f.features.filter((_, i) => i !== idx),
      }));

    const showPricing =
      courseForm.category === "pricing" || courseForm.category === "premium";
    const showIcon = courseForm.category === "core";
    const categoryInfo = COURSE_CATEGORIES.find(
      (c) => c.value === courseForm.category,
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setCourseModalOpen(false)}
        />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-primary">
              {editingCourse ? "Edit Course" : "Create Course"}
            </h2>
            <button
              onClick={() => setCourseModalOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COURSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() =>
                      setCourseForm((f) => ({
                        ...f,
                        category: cat.value as Course["category"],
                      }))
                    }
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      courseForm.category === cat.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {categoryInfo && (
                <p className="mt-1.5 text-xs text-gray-400">
                  {categoryInfo.hint}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {courseForm.category === "premium"
                  ? "Session Format Title (e.g. 1-on-1)"
                  : "Course Title"}{" "}
                *
              </label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder={
                  courseForm.category === "premium"
                    ? "e.g. 1-on-1"
                    : "e.g. Communication Skills"
                }
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short description shown on the website card"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition resize-none"
              />
            </div>

            {/* Price (pricing + premium only) */}
            {showPricing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    value={courseForm.price}
                    onChange={(e) =>
                      setCourseForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="e.g. 1,000"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={courseForm.order}
                    onChange={(e) =>
                      setCourseForm((f) => ({
                        ...f,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                  />
                </div>
              </div>
            )}

            {/* Display order (core only) */}
            {showIcon && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Icon
                  </label>
                  <select
                    value={courseForm.iconKey}
                    onChange={(e) =>
                      setCourseForm((f) => ({ ...f, iconKey: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition bg-white"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={courseForm.order}
                    onChange={(e) =>
                      setCourseForm((f) => ({
                        ...f,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                  />
                </div>
              </div>
            )}

            {/* Features (pricing + premium only) */}
            {showPricing && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Features / Inclusions
                </label>
                <div className="space-y-2">
                  {courseForm.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        placeholder={`Feature ${i + 1}`}
                        className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                      />
                      {courseForm.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition flex-shrink-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition mt-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Feature
                  </button>
                </div>
              </div>
            )}

            {/* Featured toggle (pricing + premium only) */}
            {showPricing && (
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Mark as &quot;Most Popular&quot;
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Shows a highlighted badge and elevated card style
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCourseForm((f) => ({ ...f, featured: !f.featured }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${courseForm.featured ? "bg-amber-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${courseForm.featured ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            )}

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Publish to website
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  When active, this course appears on the homepage
                </p>
              </div>
              <button
                onClick={() =>
                  setCourseForm((f) => ({ ...f, isActive: !f.isActive }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${courseForm.isActive ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${courseForm.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
            <button
              onClick={() => setCourseModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveCourse}
              disabled={courseSaving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {courseSaving && (
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {editingCourse ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Job Modal ───────────────────────────────────────────────────────────────

  const JobModal = () => {
    const updateBullet = (
      field: "responsibilities" | "eligibility",
      idx: number,
      val: string,
    ) => {
      setJobForm((f) => {
        const arr = [...f[field]];
        arr[idx] = val;
        return { ...f, [field]: arr };
      });
    };
    const addBullet = (field: "responsibilities" | "eligibility") =>
      setJobForm((f) => ({ ...f, [field]: [...f[field], ""] }));
    const removeBullet = (
      field: "responsibilities" | "eligibility",
      idx: number,
    ) =>
      setJobForm((f) => ({
        ...f,
        [field]: f[field].filter((_, i) => i !== idx),
      }));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setJobModalOpen(false)}
        />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-primary">
              {editingJob ? "Edit Job Posting" : "Create Job Posting"}
            </h2>
            <button
              onClick={() => setJobModalOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={jobForm.title}
                onChange={(e) =>
                  setJobForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Sales Executive"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
              />
            </div>

            {/* Type + WorkMode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Job Type *
                </label>
                <select
                  value={jobForm.type}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition bg-white"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Work Mode *
                </label>
                <select
                  value={jobForm.workMode}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, workMode: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition bg-white"
                >
                  {JOB_WORKMODES.map((w) => (
                    <option key={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Responsibilities
              </label>
              <div className="space-y-2">
                {jobForm.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={r}
                      onChange={(e) =>
                        updateBullet("responsibilities", i, e.target.value)
                      }
                      placeholder={`Responsibility ${i + 1}`}
                      className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                    />
                    {jobForm.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeBullet("responsibilities", i)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addBullet("responsibilities")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition mt-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Responsibility
                </button>
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Eligibility
              </label>
              <div className="space-y-2">
                {jobForm.eligibility.map((e, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={e}
                      onChange={(ev) =>
                        updateBullet("eligibility", i, ev.target.value)
                      }
                      placeholder={`Eligibility ${i + 1}`}
                      className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                    />
                    {jobForm.eligibility.length > 1 && (
                      <button
                        onClick={() => removeBullet("eligibility", i)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addBullet("eligibility")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition mt-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Eligibility
                </button>
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Publish to website
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  When active, this job appears on the Careers page
                </p>
              </div>
              <button
                onClick={() =>
                  setJobForm((f) => ({ ...f, isActive: !f.isActive }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${jobForm.isActive ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${jobForm.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
            <button
              onClick={() => setJobModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveJob}
              disabled={jobSaving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {jobSaving && (
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {editingJob ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Row classes ─────────────────────────────────────────────────────────────

  const thClass =
    "px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-5 py-4";

  const rowClass = (status: string) =>
    `transition-colors cursor-pointer ${
      status === "not_read"
        ? "border-l-2 border-l-blue-400 bg-blue-50/30 hover:bg-blue-50/50"
        : "border-l-2 border-l-transparent hover:bg-gray-50"
    }`;

  // ─── Render ──────────────────────────────────────────────────────────────────

  const activeStatuses =
    activeSection === "applications" ? APP_STATUSES : CONTACT_STATUSES;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <ToastContainer toasts={toasts} />

      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {jobModalOpen && JobModal()}
      {courseModalOpen && CourseModal()}

      <SlideOver
        item={detailItem}
        section={activeSection}
        onClose={() => setDetailItem(null)}
        onStatusChange={(id, status) => updateStatus(activeSection, id, status)}
        statuses={activeStatuses}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-primary">
                {currentNav.label}
              </h1>
              <p className="text-xs text-gray-500">
                {currentNav.count} total
                {currentNav.pending > 0 && ` · ${currentNav.pending} unread`}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats cards */}
          <StatsCards cards={statsCards[activeSection]} loading={loading} />

          {/* Search + filter — only for data tabs, not jobs/courses */}
          {!loading &&
            activeSection !== "jobs" &&
            activeSection !== "courses" && (
              <SearchAndFilterBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
                filterOptions={FILTER_OPTIONS[activeSection]}
                resultCount={activeFilteredRows.length}
              />
            )}

          {/* ── Contacts Table ─────────────────────────────────────────── */}
          {activeSection === "contacts" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
              {!loading && filteredContacts.length === 0 ? (
                <EmptyState
                  label={
                    searchQuery || statusFilter !== "all"
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
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <SortableTh
                          label="Email"
                          sortKey="email"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Phone</th>
                        <th className={thClass}>Message</th>
                        <SortableTh
                          label="Status"
                          sortKey="status"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <SortableTh
                          label="Date"
                          sortKey="createdAt"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <SkeletonRows cols={7} />
                      ) : (
                        filteredContacts.map((c) => (
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
                            <td className={tdClass}>
                              <ActionDropdown
                                id={c._id}
                                name={c.name}
                                currentStatus={c.status}
                                statuses={CONTACT_STATUSES}
                                endpoint="/api/admin/contacts"
                                onStatusChange={(id, s) =>
                                  updateStatus("contacts", id, s)
                                }
                                onDelete={(id, name) =>
                                  requestDelete(id, name, "contacts")
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Demo Bookings Table ────────────────────────────────────── */}
          {activeSection === "demo-bookings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
              {!loading && filteredDemoBookings.length === 0 ? (
                <EmptyState
                  label={
                    searchQuery || statusFilter !== "all"
                      ? "No results match your filters"
                      : "No demo bookings yet"
                  }
                  icon={
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Phone</th>
                        <th className={thClass}>Email</th>
                        <SortableTh
                          label="Course"
                          sortKey="course"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Message</th>
                        <SortableTh
                          label="Status"
                          sortKey="status"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <SortableTh
                          label="Date"
                          sortKey="createdAt"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <SkeletonRows cols={8} />
                      ) : (
                        filteredDemoBookings.map((d) => (
                          <tr
                            key={d._id}
                            className={rowClass(d.status)}
                            onClick={() => setDetailItem(d)}
                          >
                            <td
                              className={`${tdClass} font-medium text-gray-900 whitespace-nowrap`}
                            >
                              {d.name}
                            </td>
                            <td className={`${tdClass} whitespace-nowrap`}>
                              <a
                                href={`tel:${d.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-600 hover:text-accent transition"
                              >
                                {d.phone}
                              </a>
                            </td>
                            <td className={tdClass}>
                              {d.email ? (
                                <a
                                  href={`mailto:${d.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-accent hover:underline"
                                >
                                  {d.email}
                                </a>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className={tdClass}>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                                {d.course}
                              </span>
                            </td>
                            <td
                              className={`${tdClass} text-gray-600 max-w-xs truncate`}
                            >
                              {d.message || "—"}
                            </td>
                            <td className={tdClass}>
                              <StatusBadge status={d.status} />
                            </td>
                            <td
                              className={`${tdClass} text-gray-500 whitespace-nowrap`}
                            >
                              {formatDate(d.createdAt)}
                            </td>
                            <td className={tdClass}>
                              <ActionDropdown
                                id={d._id}
                                name={d.name}
                                currentStatus={d.status}
                                statuses={CONTACT_STATUSES}
                                endpoint="/api/admin/demo-bookings"
                                onStatusChange={(id, s) =>
                                  updateStatus("demo-bookings", id, s)
                                }
                                onDelete={(id, name) =>
                                  requestDelete(id, name, "demo-bookings")
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Applications Table ─────────────────────────────────────── */}
          {activeSection === "applications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
              {!loading && filteredApplications.length === 0 ? (
                <EmptyState
                  label={
                    searchQuery || statusFilter !== "all"
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
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <SortableTh
                          label="Email"
                          sortKey="email"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Phone</th>
                        <SortableTh
                          label="Position"
                          sortKey="position"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Message</th>
                        <SortableTh
                          label="Status"
                          sortKey="status"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <SortableTh
                          label="Date"
                          sortKey="createdAt"
                          currentSortKey={sortKey}
                          currentSortDir={sortDir}
                          onSort={handleSort}
                        />
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <SkeletonRows cols={8} />
                      ) : (
                        filteredApplications.map((a) => (
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
                            <td className={tdClass}>
                              <ActionDropdown
                                id={a._id}
                                name={a.name}
                                currentStatus={a.status}
                                statuses={APP_STATUSES}
                                endpoint="/api/admin/applications"
                                onStatusChange={(id, s) =>
                                  updateStatus("applications", id, s)
                                }
                                onDelete={(id, name) =>
                                  requestDelete(id, name, "applications")
                                }
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {/* ── Job Postings ───────────────────────────────────────── */}
          {activeSection === "jobs" && (
            <>
              {/* Toolbar */}
              {!loading && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {jobs.length} posting{jobs.length !== 1 ? "s" : ""} total
                  </p>
                  <button
                    onClick={openCreateJob}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Job Posting
                  </button>
                </div>
              )}

              {loading ? (
                /* Skeleton cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
                    >
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                        <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[240px] flex flex-col items-center justify-center text-gray-400 gap-3">
                  <svg
                    className="w-12 h-12 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium">No job postings yet</p>
                  <button
                    onClick={openCreateJob}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Create your first posting →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-primary leading-tight truncate">
                            {job.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(job.createdAt)}
                          </p>
                        </div>
                        {/* Active toggle */}
                        <button
                          onClick={() => toggleJobActive(job)}
                          title={
                            job.isActive
                              ? "Click to hide from website"
                              : "Click to publish to website"
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${job.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${job.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                          />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                          {job.workMode}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {job.isActive ? "Live" : "Hidden"}
                        </span>
                      </div>

                      {/* Responsibilities preview */}
                      {job.responsibilities.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Responsibilities
                          </p>
                          <ul className="space-y-1">
                            {job.responsibilities.slice(0, 3).map((r, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-gray-600"
                              >
                                <span className="text-accent mt-0.5 flex-shrink-0">
                                  •
                                </span>
                                {r}
                              </li>
                            ))}
                            {job.responsibilities.length > 3 && (
                              <li className="text-xs text-gray-400 pl-3.5">
                                +{job.responsibilities.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1 border-t border-gray-100">
                        <button
                          onClick={() => openEditJob(job)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteJob(job)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* ── Courses ────────────────────────────────────────────── */}
          {activeSection === "courses" && (
            <>
              {/* Toolbar */}
              {!loading && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {courses.length} course{courses.length !== 1 ? "s" : ""}{" "}
                    total
                  </p>
                  <button
                    onClick={openCreateCourse}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Course
                  </button>
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
                    >
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="h-16 bg-gray-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[240px] flex flex-col items-center justify-center text-gray-400 gap-3">
                  <svg
                    className="w-12 h-12 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <p className="text-sm font-medium">No courses yet</p>
                  <button
                    onClick={openCreateCourse}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Create your first course →
                  </button>
                </div>
              ) : (
                /* Group courses by category */
                (["core", "pricing", "premium"] as Course["category"][]).map(
                  (cat) => {
                    const catCourses = courses.filter(
                      (c) => c.category === cat,
                    );
                    if (catCourses.length === 0) return null;
                    const catLabel =
                      COURSE_CATEGORIES.find((c) => c.value === cat)?.label ??
                      cat;
                    return (
                      <div key={cat} className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                            {catLabel}s
                          </h3>
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400">
                            {catCourses.length} item
                            {catCourses.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {catCourses.map((course) => (
                            <div
                              key={course._id}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
                            >
                              {/* Card header */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-primary leading-tight truncate">
                                    {course.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                    {course.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => toggleCourseActive(course)}
                                  title={
                                    course.isActive
                                      ? "Click to hide from website"
                                      : "Click to publish"
                                  }
                                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${course.isActive ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                  <span
                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${course.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                                  />
                                </button>
                              </div>

                              {/* Badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {course.price && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/15 text-accent">
                                    ₹{course.price}
                                  </span>
                                )}
                                {course.featured && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                                    Most Popular
                                  </span>
                                )}
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                  Order: {course.order}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${course.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                >
                                  {course.isActive ? "Live" : "Hidden"}
                                </span>
                              </div>

                              {/* Features preview (pricing/premium) */}
                              {course.features.length > 0 && (
                                <ul className="space-y-1">
                                  {course.features.slice(0, 3).map((f, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-xs text-gray-600"
                                    >
                                      <span className="text-accent mt-0.5 flex-shrink-0">
                                        ✓
                                      </span>
                                      {f}
                                    </li>
                                  ))}
                                  {course.features.length > 3 && (
                                    <li className="text-xs text-gray-400 pl-3.5">
                                      +{course.features.length - 3} more
                                    </li>
                                  )}
                                </ul>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 pt-1 border-t border-gray-100">
                                <button
                                  onClick={() => openEditCourse(course)}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteTarget({
                                      id: course._id,
                                      name: course.title,
                                      type: "courses",
                                    })
                                  }
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
