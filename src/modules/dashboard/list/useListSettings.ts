"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ListSettings } from "@/modules/dashboard/list/types";

const CHANGE_EVENT = "list-settings-change";
// Fallback when localStorage is unavailable, so settings still work this visit
const memory = new Map<string, string>();
const storageKey = (listId: string) => `dashboard:list:${listId}`;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Per-list settings saved in localStorage. The server snapshot is always the
 * defaults, so server and first client render match (no hydration mismatch).
 */
export function useListSettings(listId: string, defaults: ListSettings) {
  const key = storageKey(listId);

  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
      } catch {
        return memory.get(key) ?? null; // storage blocked (private mode etc.)
      }
    },
    () => null,
  );

  const settings = useMemo<ListSettings>(() => {
    if (!raw) return defaults;
    try {
      return { ...defaults, ...(JSON.parse(raw) as Partial<ListSettings>) };
    } catch {
      return defaults;
    }
    // defaults is an inline object per render; the stored value is what matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const update = useCallback(
    (changes: Partial<ListSettings>) => {
      const value = JSON.stringify({ ...settings, ...changes });
      memory.set(key, value);
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage blocked — the in-memory copy still applies this visit
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key, settings],
  );

  const reset = useCallback(() => {
    memory.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [key]);

  return { settings, update, reset };
}
