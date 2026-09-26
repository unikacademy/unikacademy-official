import { sendEmail } from "@/lib/email";

type ContactNotification = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function notifyContactSubmission(contact: ContactNotification) {
  const adminEmail = process.env.ADMIN_EMAIL;

  await Promise.allSettled([
    adminEmail &&
      sendEmail({
        to: adminEmail,
        subject: `New contact form submission from ${contact.name}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
        `,
      }),
    sendEmail({
      to: contact.email,
      subject: "We received your message — UnikAcademy",
      html: `
        <p>Hi ${contact.name},</p>
        <p>Thanks for reaching out to UnikAcademy. We've received your message and our team will get back to you shortly.</p>
        <p>— Team UnikAcademy</p>
      `,
    }),
  ]);
}
