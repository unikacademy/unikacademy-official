"use client";

import type { ReactNode } from "react";
import { useDemoPopup } from "./DemoPopupProvider";

type BookingType = "individual" | "corporate";

/**
 * A button that opens the single globally-mounted DemoPopup dialog (see
 * DemoPopupProvider), so server-component pages can offer a "book a demo"
 * CTA — with the individual/corporate toggle — without duplicating the form.
 */
export default function OpenDemoPopupButton({
  bookingType,
  className,
  children,
}: {
  bookingType?: BookingType;
  className?: string;
  children: ReactNode;
}) {
  const { requestOpen } = useDemoPopup();

  return (
    <button
      type="button"
      onClick={() => requestOpen(bookingType)}
      className={className}
    >
      {children}
    </button>
  );
}
