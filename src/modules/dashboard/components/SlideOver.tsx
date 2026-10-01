"use client";

import { useState } from "react";
import type { Contact } from "@/modules/contacts/types";
import type { DemoBooking } from "@/modules/demo-bookings/types";
import type { Application } from "@/modules/applications/types";
import type { ActiveSection, AnyRecord } from "@/modules/dashboard/types";
import { formatDate } from "@/modules/dashboard/format";
import { STATUS_STYLE, STATUS_DOT } from "@/modules/dashboard/status";
import { BookingTypeBadge } from "@/modules/demo-bookings/components/BookingTypeBadge";

export function SlideOver({
  item,
  section,
  onClose,
  onStatusChange,
  statuses,
  readOnly = false,
  extra,
}: {
  item: AnyRecord | null;
  section: ActiveSection;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  statuses: { value: string; label: string; color: string }[];
  // Hide the status selector for users who can view but not manage
  readOnly?: boolean;
  // Section-specific content shown above the message (e.g. demo assignment)
  extra?: React.ReactNode;
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
        {!readOnly && (
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
        )}

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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {booking.bookingType === "corporate"
                    ? "Training Requirement"
                    : "Course Interested In"}
                </p>
                <BookingTypeBadge type={booking.bookingType} />
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {booking.course}
              </span>
              {booking.bookingType === "corporate" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Company
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.companyName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Company Size
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.companySize || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Participants
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.participants ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Preferred Date
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.preferredDate
                        ? formatDate(booking.preferredDate)
                        : "—"}
                    </p>
                  </div>
                </div>
              )}
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

          {extra}

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
