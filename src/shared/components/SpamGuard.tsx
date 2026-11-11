"use client";

import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD, type TurnstileAction } from "@/shared/spam-guard";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// One script tag for the whole page, however many forms are on it.
let turnstileScript: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  turnstileScript ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("Turnstile did not initialise"));
    script.onerror = () => {
      turnstileScript = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return turnstileScript;
}

/**
 * Client half of the public-form bot check (`spamGuardResponse` on the server):
 * honeypot field, fill-time and a Cloudflare Turnstile token.
 *
 * Render `field` at the top of the form and `widget` above the submit button,
 * and spread `values()` into the request body. `action` must match the one the
 * endpoint checks.
 */
export function useSpamGuard(
  action: TurnstileAction,
  theme: "light" | "dark" = "light",
) {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef("");
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();

    const el = widgetRef.current;
    if (!SITE_KEY || !el) return;

    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;
        widgetId.current = turnstile.render(el, {
          sitekey: SITE_KEY,
          action,
          theme,
          // Invisible unless Cloudflare wants the visitor to tick the box.
          appearance: "interaction-only",
          callback: (value: string) => {
            token.current = value;
          },
          "expired-callback": () => {
            token.current = "";
          },
          "error-callback": () => {
            token.current = "";
          },
        });
      })
      // Blocked or offline: submit without a token and let the server decide.
      .catch(() => {});

    return () => {
      cancelled = true;
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
      token.current = "";
    };
  }, [action, theme]);

  // Off-screen rather than display:none — some bots skip fields that are
  // plainly hidden. Out of the tab order and hidden from screen readers.
  const field = (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label>
        Website
        <input
          ref={honeypotRef}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );

  const widget = SITE_KEY ? <div ref={widgetRef} /> : null;

  /** Call once per submit: a Turnstile token only works for one request. */
  const values = () => {
    const turnstileToken = token.current;
    // Start a fresh challenge now so a retry has a new token ready.
    token.current = "";
    if (widgetId.current) window.turnstile?.reset(widgetId.current);

    return {
      [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
      elapsedMs: Date.now() - shownAt.current,
      turnstileToken,
    };
  };

  return { field, widget, values };
}
