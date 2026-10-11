import type { LeadDetails } from "./types";

// TEMPORARY: UI-only stand-ins. Replace both with calls to /api/chat and the
// lead-saving tool once the backend exists.

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBotReply(
  userText: string,
): Promise<{ text: string; leadForm?: boolean }> {
  await wait(900);
  const q = userText.toLowerCase();

  if (/demo|book|trial|free/.test(q)) {
    return {
      text: "Our free demo is a live 1-on-1 session with a teacher, no payment needed. Share your details and we'll schedule it for you.",
      leadForm: true,
    };
  }
  if (/fee|price|cost|₹|rs/.test(q)) {
    return {
      text: "Fees depend on the course. Book a free demo and our team will walk you through the exact price and any offers.",
      leadForm: true,
    };
  }
  if (/course|learn|program/.test(q)) {
    return {
      text: "We offer 1-on-1 live courses, starting with Communication Skills. Tell me your goal and I'll suggest the right one.",
    };
  }
  return {
    text: "I can help with our courses, fees, teachers and the free demo. What would you like to know?",
  };
}

export async function submitLead(lead: LeadDetails): Promise<void> {
  void lead;
  await wait(700);
}
