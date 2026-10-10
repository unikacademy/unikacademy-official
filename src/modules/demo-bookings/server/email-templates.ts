// Edit the wording / styling of demo-booking emails here. Each function
// returns the subject + HTML; sending lives in ./notify.ts.

export type DemoBookingEmailData = {
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  bookingType: "individual" | "corporate";
  companyName?: string | null;
  companySize?: string | null;
  participants?: number | null;
  preferredDate?: string | null;
};

const SITE_URL = "https://unikacademy.in/";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Confirmation sent to the person who booked the demo. */
export function demoConfirmationEmail(
  booking: Pick<DemoBookingEmailData, "name" | "course">,
) {
  return {
    subject: "We received your demo request — UnikAcademy",
    html: `
      <p>Hello ${escapeHtml(booking.name)},</p>
      <p>We have received your demo request for <strong>${escapeHtml(booking.course)}</strong>. Thank you for choosing us!</p>
      <p>Our coordinator or counsellor will contact you as soon as possible.</p>
      <p>Until then, you can visit our page: <a href="${SITE_URL}">${SITE_URL}</a></p>
      <p>Thanks,<br/>Team UnikAcademy</p>
    `,
  };
}

/** Notification sent to ADMIN_EMAIL for every new booking. */
export function demoAdminNotificationEmail(booking: DemoBookingEmailData) {
  const isCorporate = booking.bookingType === "corporate";
  return {
    subject: `New ${isCorporate ? "corporate" : "individual"} demo booking — ${booking.name}`,
    html: `
      <h2>New demo booking (${isCorporate ? "corporate" : "individual"})</h2>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      ${booking.email ? `<p><strong>Email:</strong> ${booking.email}</p>` : ""}
      <p><strong>Course:</strong> ${booking.course}</p>
      ${isCorporate ? `<p><strong>Company:</strong> ${booking.companyName ?? ""}</p>` : ""}
      ${isCorporate && booking.companySize ? `<p><strong>Company size:</strong> ${booking.companySize}</p>` : ""}
      ${isCorporate && booking.participants ? `<p><strong>Participants:</strong> ${booking.participants}</p>` : ""}
      ${isCorporate && booking.preferredDate ? `<p><strong>Preferred date:</strong> ${booking.preferredDate}</p>` : ""}
      ${booking.message ? `<p><strong>Message:</strong></p><p>${booking.message}</p>` : ""}
    `,
  };
}
