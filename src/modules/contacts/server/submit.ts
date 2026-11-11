import { supabaseAdmin } from "@/lib/supabase-admin";
import { ok, err } from "@/lib/api";
import {
  asText,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
} from "@/shared/validation";
import { spamGuardResponse, type SpamGuardFields } from "@/shared/spam-guard";
import { notifyContactSubmission } from "./notify";

const SUCCESS_MESSAGE = "Contact form submitted successfully";

export async function submitContact(
  body: SpamGuardFields & {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  },
) {
  const blocked = await spamGuardResponse(body, {
    action: "contact",
    successMessage: SUCCESS_MESSAGE,
  });
  if (blocked) return blocked;

  const name = asText(body.name);
  const email = asText(body.email);
  const phone = asText(body.phone);
  const message = asText(body.message);

  if (!name || !email || !message) {
    return err("Name, email, and message are required", 400);
  }

  // Phone is optional on the contact form — checked only when given.
  const invalid =
    validateName(name) ??
    validateEmail(email) ??
    (phone ? validatePhone(phone) : null) ??
    validateMessage(message, true);
  if (invalid) return err(invalid, 400);

  const { error } = await supabaseAdmin
    .from("contacts")
    .insert({ name, email, phone: phone || null, message });

  if (error) throw error;

  await notifyContactSubmission({
    name,
    email,
    phone: phone || undefined,
    message,
  });

  return ok({ message: SUCCESS_MESSAGE }, 201);
}
