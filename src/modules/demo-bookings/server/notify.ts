import { sendEmail } from "@/lib/email";

type BookingType = "individual" | "corporate";

type DemoBookingNotification = {
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  bookingType: BookingType;
  companyName?: string | null;
  companySize?: string | null;
  participants?: number | null;
  preferredDate?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyDemoBookingSubmission(
  booking: DemoBookingNotification,
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const isCorporate = booking.bookingType === "corporate";

  await Promise.allSettled([
    adminEmail &&
      sendEmail({
        to: adminEmail,
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
      }),
    booking.email &&
      sendEmail({
        to: booking.email,
        bcc: adminEmail || undefined,
        subject: "We received your demo request — UnikAcademy",
        html: `
          <p>Hello ${escapeHtml(booking.name)},</p>
          <p>We have received your demo request for <strong>${escapeHtml(booking.course)}</strong>. Thank you for choosing us!</p>
          <p>Our coordinator or counsellor will contact you as soon as possible.</p>
          <p>Until then, you can visit our page: <a href="https://unikacademy.in/">https://unikacademy.in/</a></p>
          <p>Thanks,<br/>Team UnikAcademy</p>
        `,
      }),
  ]);
}
