import { ok, err } from "@/lib/api";

/** Hidden form field — people never see it, form-filling bots fill it in. */
export const HONEYPOT_FIELD = "website";

/** Nobody fills a form in faster than this; bots submit almost instantly. */
export const MIN_FILL_MS = 3000;

/** One per protected endpoint — the widget and the server must agree on it. */
export type TurnstileAction = "contact" | "demo-booking" | "application";

export type SpamGuardFields = {
  [HONEYPOT_FIELD]?: unknown;
  elapsedMs?: unknown;
  turnstileToken?: unknown;
};

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Checks a Cloudflare Turnstile token (tokens are single-use, valid 5 min).
 * Fails open when the check itself can't run — secret not configured, or
 * Cloudflare unreachable — so an outage never costs a real enquiry; the
 * honeypot, timing and field validation still apply.
 */
async function verifyTurnstile(
  token: unknown,
  action: TurnstileAction,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("Spam guard: TURNSTILE_SECRET_KEY is not set, check skipped");
    return true;
  }
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
    });
    const result: { success?: boolean; action?: string } = await res.json();
    return result.success === true && result.action === action;
  } catch (error) {
    console.error("Spam guard: Turnstile siteverify unreachable:", error);
    return true;
  }
}

/**
 * Bot check for the public forms (pairs with `useSpamGuard` on the client).
 * Returns a response to send back straight away, or `null` to carry on.
 *
 * - Honeypot filled → pretend it worked (same response as a real submit), so
 *   the bot gets no signal to adapt to. Nothing is saved or emailed.
 * - Sent too fast / no timing / Turnstile failed → 400 with a message, so a
 *   real person who somehow trips it can simply try again.
 */
export async function spamGuardResponse(
  body: SpamGuardFields,
  {
    action,
    successMessage,
  }: { action: TurnstileAction; successMessage: string },
) {
  if (body[HONEYPOT_FIELD]) {
    console.warn("Spam guard: honeypot filled, submission dropped");
    return ok({ message: successMessage }, 201);
  }

  const { elapsedMs } = body;
  if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs)) {
    return err("Please refresh the page and try again.", 400);
  }
  if (elapsedMs < MIN_FILL_MS) {
    return err("Please wait a moment and try again.", 400);
  }

  if (!(await verifyTurnstile(body.turnstileToken, action))) {
    return err(
      "We couldn't verify you're human. Please complete the check and try again.",
      400,
    );
  }

  return null;
}
