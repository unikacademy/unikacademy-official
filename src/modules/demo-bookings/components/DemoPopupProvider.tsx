"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

type BookingType = "individual" | "corporate";
type OpenHandler = (bookingType?: BookingType) => void;

type DemoPopupContextValue = {
  registerOpenHandler: (handler: OpenHandler) => void;
  requestOpen: (bookingType?: BookingType) => void;
};

const DemoPopupContext = createContext<DemoPopupContextValue | null>(null);

export function DemoPopupProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<OpenHandler | null>(null);

  const registerOpenHandler = useCallback((handler: OpenHandler) => {
    handlerRef.current = handler;
  }, []);

  const requestOpen = useCallback((bookingType?: BookingType) => {
    handlerRef.current?.(bookingType);
  }, []);

  return (
    <DemoPopupContext.Provider value={{ registerOpenHandler, requestOpen }}>
      {children}
    </DemoPopupContext.Provider>
  );
}

/**
 * Lets any component (e.g. a CTA button on the homepage) open the single
 * globally-mounted DemoPopup dialog instead of duplicating its form.
 */
export function useDemoPopup() {
  const ctx = useContext(DemoPopupContext);
  if (!ctx) {
    throw new Error("useDemoPopup must be used within a DemoPopupProvider");
  }
  return ctx;
}
