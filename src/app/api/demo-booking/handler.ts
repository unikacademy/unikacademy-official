import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";

type BookingType = "individual" | "corporate";

export async function submitDemoBooking(body: {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  message?: string;
  bookingType?: BookingType;
  companyName?: string;
  companySize?: string;
  participants?: number;
  preferredDate?: string;
}) {
  const {
    name,
    email,
    phone,
    course,
    message,
    companySize,
    participants,
    preferredDate,
  } = body;
  const bookingType: BookingType =
    body.bookingType === "corporate" ? "corporate" : "individual";
  const companyName = body.companyName?.trim();

  if (!name || !phone || !course) {
    return err("Name, phone, and course are required", 400);
  }

  if (bookingType === "corporate") {
    if (!companyName) {
      return err("Company name is required for corporate bookings", 400);
    }
    if (!email) {
      return err("Business email is required for corporate bookings", 400);
    }
  }

  const { error } = await supabaseAdmin.from("demo_bookings").insert({
    name,
    email,
    phone,
    course,
    message,
    booking_type: bookingType,
    company_name: bookingType === "corporate" ? companyName : null,
    company_size: bookingType === "corporate" ? companySize : null,
    participants: bookingType === "corporate" ? (participants ?? null) : null,
    preferred_date:
      bookingType === "corporate" ? (preferredDate || null) : null,
  });

  if (error) throw error;

  return ok({ message: "Demo booking submitted successfully" }, 201);
}
