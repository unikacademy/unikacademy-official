import { Resend } from "resend";

// Lazily created so a missing RESEND_API_KEY doesn't throw at module load/build time.
let _client: Resend | null = null;

function getClient(): Resend {
  if (!_client) {
    _client = new Resend(process.env.RESEND_API_KEY);
  }
  return _client;
}

/**
 * Sends a transactional email via Resend. Never throws — a flaky email
 * provider must not turn an already-successful DB write into a failed
 * request. Failures are logged and swallowed.
 */
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const { error } = await getClient().emails.send({
      from: process.env.EMAIL_FROM ?? "UnikAcademy <onboarding@resend.dev>",
      ...params,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
