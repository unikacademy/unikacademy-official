export type ContactStatus = "not_read" | "read" | "replied";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export const CONTACT_STATUSES: {
  value: ContactStatus;
  label: string;
  color: string;
}[] = [
  { value: "not_read", label: "Not Read", color: "text-blue-500" },
  { value: "read", label: "Read", color: "text-gray-400" },
  { value: "replied", label: "Replied", color: "text-green-500" },
];
