import { sendEmail } from "@/lib/email";

type ApplicationNotification = {
  name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
};

export async function notifyApplicationSubmission(
  application: ApplicationNotification,
) {
  const adminEmail = process.env.ADMIN_EMAIL;

  await Promise.allSettled([
    adminEmail &&
      sendEmail({
        to: adminEmail,
        subject: `New job application: ${application.position} — ${application.name}`,
        html: `
          <h2>New job application</h2>
          <p><strong>Position:</strong> ${application.position}</p>
          <p><strong>Name:</strong> ${application.name}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Phone:</strong> ${application.phone}</p>
          ${application.message ? `<p><strong>Message:</strong></p><p>${application.message}</p>` : ""}
        `,
      }),
    sendEmail({
      to: application.email,
      subject: "We received your application — UnikAcademy",
      html: `
        <p>Hi ${application.name},</p>
        <p>Thanks for applying for the <strong>${application.position}</strong> position at UnikAcademy. We've received your application and our team will review it and reach out if there's a fit.</p>
        <p>— Team UnikAcademy</p>
      `,
    }),
  ]);
}
