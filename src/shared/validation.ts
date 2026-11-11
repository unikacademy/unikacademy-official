const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;

export function validatePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().+]/g, "");
  if (!digits) return "Phone number is required.";
  if (!/^\d+$/.test(digits)) return "Phone number must contain only digits.";
  if (digits.length !== 10) return "Phone number must be exactly 10 digits.";
  if (!INDIAN_MOBILE_RE.test(digits))
    return "Enter a valid Indian mobile number (starts with 6–9).";
  return null;
}

export function validateName(raw: string): string | null {
  const name = raw.trim();
  if (!name) return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 60) return "Name is too long.";
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) return "Name must contain only letters.";
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(raw: string): string | null {
  const email = raw.trim();
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return null;
}

export function validateCompanyName(raw: string): string | null {
  const name = raw.trim();
  if (!name) return "Company name is required.";
  if (name.length < 2) return "Company name must be at least 2 characters.";
  if (name.length > 100) return "Company name is too long.";
  return null;
}

const MESSAGE_MAX = 2000;

// Bot filler text is one long unbroken run of letters with random capitals
// (e.g. "SmgKUoozJAiYFtQyRlvWIVv"). Real messages have spaces or are short.
function looksLikeGibberish(text: string): boolean {
  if (!/^[a-zA-Z]{12,}$/.test(text)) return false;
  if (text === text.toUpperCase()) return false;
  return text.slice(1).replace(/[^A-Z]/g, "").length >= 3;
}

export function validateMessage(raw: string, required = false): string | null {
  const message = raw.trim();
  if (!message) return required ? "Message is required." : null;
  if (message.length > MESSAGE_MAX) return "Message is too long.";
  if (looksLikeGibberish(message)) return "Please enter a valid message.";
  return null;
}

/** Form bodies are untyped JSON — anything that isn't a string counts as empty. */
export function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
