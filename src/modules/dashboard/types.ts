import type { Contact } from "@/modules/contacts/types";
import type { DemoBooking } from "@/modules/demo-bookings/types";
import type { Application } from "@/modules/applications/types";

export type ActiveSection =
  "contacts" | "demo-bookings" | "applications" | "jobs" | "courses";

export type AnyRecord = Contact | DemoBooking | Application;

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}
