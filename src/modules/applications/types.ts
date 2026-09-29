export type AppStatus = "not_read" | "read" | "shortlisted" | "rejected";

export interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  status: AppStatus;
  createdAt: string;
}

export const APP_STATUSES: { value: AppStatus; label: string; color: string }[] = [
  { value: "not_read", label: "Not Read", color: "text-blue-500" },
  { value: "read", label: "Read", color: "text-gray-400" },
  { value: "shortlisted", label: "Shortlisted", color: "text-purple-500" },
  { value: "rejected", label: "Rejected", color: "text-red-500" },
];
