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
        subject: "We received your demo booking request — UnikAcademy",
        html: `
          <p>Hi ${booking.name},</p>
          <p>Thanks for requesting a demo for <strong>${booking.course}</strong>. We've received your request and our team will reach out shortly to schedule it.</p>
          <p>— Team UnikAcademy</p>
        `,
      }),
  ]);
}
