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
import { notifyApplicationSubmission } from "./notify";

const POSITION_MAX = 150;

const SUCCESS_MESSAGE = "Application submitted successfully";

export async function submitApplication(
  body: SpamGuardFields & {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    message?: string;
  },
) {
  const blocked = await spamGuardResponse(body, {
    action: "application",
    successMessage: SUCCESS_MESSAGE,
  });
  if (blocked) return blocked;

  const name = asText(body.name);
  const email = asText(body.email);
  const phone = asText(body.phone);
  const position = asText(body.position);
  const message = asText(body.message);

  if (!name || !email || !phone || !position) {
    return err("Name, email, phone, and position are required", 400);
  }

  const invalid =
    validateName(name) ??
    validateEmail(email) ??
    validatePhone(phone) ??
    validateMessage(message);
  if (invalid) return err(invalid, 400);

  if (position.length > POSITION_MAX) return err("Invalid position", 400);

  const { error } = await supabaseAdmin
    .from("applications")
    .insert({ name, email, phone, position, message: message || null });

  if (error) throw error;

  await notifyApplicationSubmission({
    name,
    email,
    phone,
    position,
    message: message || undefined,
  });

  return ok({ message: SUCCESS_MESSAGE }, 201);
}
