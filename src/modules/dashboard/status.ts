import type { PillTone } from "@/modules/dashboard/components/StatusPill";

// Inbox statuses shared by contacts, demo bookings and applications

export const STATUS_TONE: Record<string, PillTone> = {
  not_read: "blue",
  read: "gray",
  replied: "green",
  shortlisted: "purple",
  rejected: "red",
};

export const STATUS_LABEL: Record<string, string> = {
  not_read: "Not Read",
  read: "Read",
  replied: "Replied",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

// Tailwind classes for the status buttons in the detail panel (SlideOver)
export const STATUS_STYLE: Record<string, string> = {
  not_read: "bg-blue-50 text-blue-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-50 text-green-700",
  shortlisted: "bg-purple-50 text-purple-700",
  rejected: "bg-red-50 text-red-600",
};

export const STATUS_DOT: Record<string, string> = {
  not_read: "bg-blue-500",
  read: "bg-gray-400",
  replied: "bg-green-500",
  shortlisted: "bg-purple-500",
  rejected: "bg-red-500",
};
