import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";
import {
  asText,
  validateCompanyName,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
} from "@/shared/validation";
import { spamGuardResponse, type SpamGuardFields } from "@/shared/spam-guard";
import { notifyDemoBookingSubmission } from "./notify";

const COURSE_MAX = 150;

type BookingType = "individual" | "corporate";

const SUCCESS_MESSAGE = "Demo booking submitted successfully";

export async function submitDemoBooking(
  body: SpamGuardFields & {
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
  },
) {
  const blocked = await spamGuardResponse(body, {
    action: "demo-booking",
    successMessage: SUCCESS_MESSAGE,
  });
  if (blocked) return blocked;

  const { companySize, participants, preferredDate } = body;
  const name = asText(body.name);
  const email = asText(body.email);
  const phone = asText(body.phone);
  const course = asText(body.course);
  const message = asText(body.message);
  const bookingType: BookingType =
    body.bookingType === "corporate" ? "corporate" : "individual";
  const companyName = asText(body.companyName);

  if (!name || !phone || !course) {
    return err("Name, phone, and course are required", 400);
  }

  const invalid =
    validateName(name) ??
    validatePhone(phone) ??
    validateEmail(email) ??
    (bookingType === "corporate" ? validateCompanyName(companyName) : null) ??
    validateMessage(message);
  if (invalid) return err(invalid, 400);

  if (course.length > COURSE_MAX) return err("Invalid course", 400);

  const { error } = await supabaseAdmin.from("demo_bookings").insert({
    name,
    email,
    phone,
    course,
    message: message || null,
    booking_type: bookingType,
    company_name: bookingType === "corporate" ? companyName : null,
    company_size: bookingType === "corporate" ? companySize : null,
    participants: bookingType === "corporate" ? (participants ?? null) : null,
    preferred_date: bookingType === "corporate" ? preferredDate || null : null,
  });

  if (error) throw error;

  await notifyDemoBookingSubmission({
    name,
    email,
    phone,
    course,
    message: message || undefined,
    bookingType,
    companyName: bookingType === "corporate" ? companyName : null,
    companySize: bookingType === "corporate" ? companySize : null,
    participants: bookingType === "corporate" ? (participants ?? null) : null,
    preferredDate: bookingType === "corporate" ? preferredDate || null : null,
  });

  return ok({ message: SUCCESS_MESSAGE }, 201);
}
