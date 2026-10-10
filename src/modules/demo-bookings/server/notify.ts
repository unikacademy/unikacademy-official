import { sendEmail } from "@/lib/email";
import {
  demoAdminNotificationEmail,
  demoConfirmationEmail,
  type DemoBookingEmailData,
} from "./email-templates";

export async function notifyDemoBookingSubmission(
  booking: DemoBookingEmailData,
) {
  const adminEmail = process.env.ADMIN_EMAIL;

  await Promise.allSettled([
    adminEmail &&
      sendEmail({ to: adminEmail, ...demoAdminNotificationEmail(booking) }),
    booking.email &&
      sendEmail({
        to: booking.email,
        bcc: adminEmail || undefined,
        ...demoConfirmationEmail(booking),
      }),
  ]);
}
