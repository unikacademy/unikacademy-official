export type ChatRole = "user" | "bot";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  /** Renders the inline lead-capture card under this bot message. */
  leadForm?: boolean;
};

export type LeadDetails = {
  name: string;
  phone: string;
  email: string;
};

export const SUGGESTED_QUESTIONS = [
  "What courses do you offer?",
  "How does the free demo work?",
  "What is the course fee?",
  "Who are the teachers?",
] as const;
