import type { ContactStatus } from "@/modules/contacts/types";

export type BookingType = "individual" | "corporate";

export interface DemoBooking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  status: ContactStatus;
  bookingType: BookingType;
  companyName?: string;
  companySize?: string;
  participants?: number;
  preferredDate?: string;
  createdAt: string;
}
