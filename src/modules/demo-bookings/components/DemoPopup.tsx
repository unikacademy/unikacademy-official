"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, XIcon } from "lucide-react";
import { useDemoPopup } from "./DemoPopupProvider";
import DemoBookingForm, { type BookingType } from "./DemoBookingForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "unik_demo_popup_dismissed";
const DISMISS_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const SHOW_DELAY_MS = 2500;

const FAB_POSITION_KEY = "unik_demo_fab_position";
const FAB_SIZE = 56; // px, matches h-14 w-14
const FAB_EDGE_MARGIN = 8; // px, keeps it off the very edge of the viewport
const DRAG_THRESHOLD = 6; // px of pointer movement before a press counts as a drag
const FAB_LABEL_AUTO_SHOW_MS = 5000; // how long the "Free Demo" label stays expanded on first appearance

type FabPosition = { x: number; y: number };

function clampFabPosition(
  pos: FabPosition,
  viewportWidth: number,
  viewportHeight: number,
): FabPosition {
  return {
    x: Math.min(
      Math.max(pos.x, FAB_EDGE_MARGIN),
      viewportWidth - FAB_SIZE - FAB_EDGE_MARGIN,
    ),
    y: Math.min(
      Math.max(pos.y, FAB_EDGE_MARGIN),
      viewportHeight - FAB_SIZE - FAB_EDGE_MARGIN,
    ),
  };
}

function loadSavedFabPosition(): FabPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(FAB_POSITION_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (typeof parsed.x === "number" && typeof parsed.y === "number") {
      return clampFabPosition(parsed, window.innerWidth, window.innerHeight);
    }
  } catch {
    // Ignore malformed/inaccessible storage — falls back to default position.
  }
  return null;
}

export default function DemoPopup() {
  const pathname = usePathname();
  const { registerOpenHandler } = useDemoPopup();
  const [visible, setVisible] = useState(false);
  // initialBookingType + formKey let an external requestOpen("corporate")
  // pre-select a type by remounting DemoBookingForm with a fresh key, since
  // the booking-type toggle's state now lives inside that shared component.
  const [initialBookingType, setInitialBookingType] =
    useState<BookingType>("individual");
  const [formKey, setFormKey] = useState(0);

  // Floating button drag state — position is null until a saved position is
  // restored (client-only, after mount) or the user drags it, meaning it
  // falls back to the default bottom-right CSS placement. Must start as
  // null on both server and first client render (not read from
  // localStorage during the initial render) or hydration will mismatch.
  const [fabPosition, setFabPosition] = useState<FabPosition | null>(null);
  const [isDraggingFab, setIsDraggingFab] = useState(false);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const didDragRef = useRef(false);

  // "Free Demo" label on the floating button: expanded briefly when the
  // button first appears (so it's clear what the icon does), then collapses
  // to just the icon — same pattern chat-widget launchers use. Desktop users
  // can also re-reveal it by hovering.
  const [autoShowFabLabel, setAutoShowFabLabel] = useState(true);
  const [fabHovered, setFabHovered] = useState(false);
  const fabLabelExpanded =
    !isDraggingFab && (autoShowFabLabel || fabHovered);

  useEffect(() => {
    const timer = setTimeout(
      () => setAutoShowFabLabel(false),
      FAB_LABEL_AUTO_SHOW_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Never show on the demo page itself
    if (pathname === "/demo") return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Let another component (e.g. a homepage CTA) open this same dialog via
  // useDemoPopup().requestOpen() instead of duplicating this form.
  useEffect(() => {
    registerOpenHandler((type) => {
      setVisible(true);
      if (type) {
        setInitialBookingType(type);
        setFormKey((k) => k + 1);
      }
    });
  }, [registerOpenHandler]);

  // Restore a saved floating-button position (client-only, after mount —
  // reading localStorage during render would mismatch the server HTML),
  // and keep it on-screen if the viewport is resized (e.g. rotating a phone).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, which isn't available during SSR/first render
    setFabPosition(loadSavedFabPosition());

    const onResize = () => {
      setFabPosition((prev) =>
        prev
          ? clampFabPosition(prev, window.innerWidth, window.innerHeight)
          : prev,
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      origX: fabPosition?.x ?? rect.left,
      origY: fabPosition?.y ?? rect.top,
    };
    didDragRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = dragStartRef.current;
    if (!start) return;
    const dx = e.clientX - start.pointerX;
    const dy = e.clientY - start.pointerY;
    if (!didDragRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      didDragRef.current = true;
      setIsDraggingFab(true);
    }
    if (didDragRef.current) {
      setFabPosition(
        clampFabPosition(
          { x: start.origX + dx, y: start.origY + dy },
          window.innerWidth,
          window.innerHeight,
        ),
      );
    }
  };

  const handleFabPointerUp = () => {
    if (didDragRef.current) {
      setFabPosition((prev) => {
        if (prev) localStorage.setItem(FAB_POSITION_KEY, JSON.stringify(prev));
        return prev;
      });
    }
    dragStartRef.current = null;
    setIsDraggingFab(false);
  };

  const handleFabClick = () => {
    // Suppress the click that follows a drag so dragging doesn't also open the dialog.
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setVisible(true);
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  return (
    <>
      {/* Floating quick-action button — opens this same dialog on demand */}
      {pathname !== "/demo" && !visible && (
        <button
          type="button"
          onClick={handleFabClick}
          onPointerDown={handleFabPointerDown}
          onPointerMove={handleFabPointerMove}
          onPointerUp={handleFabPointerUp}
          onPointerCancel={handleFabPointerUp}
          onMouseEnter={() => setFabHovered(true)}
          onMouseLeave={() => setFabHovered(false)}
          aria-label="Book a free demo session"
          className="fixed bottom-24 right-4 z-40 h-14 w-14 touch-none sm:bottom-6 sm:right-6"
          style={
            fabPosition
              ? {
                  left: fabPosition.x,
                  top: fabPosition.y,
                  right: "auto",
                  bottom: "auto",
                  cursor: isDraggingFab ? "grabbing" : "grab",
                }
              : { cursor: "grab" }
          }
        >
          {/*
            Anchored top-right and absolutely positioned so it can grow/shrink
            for the label without resizing the <button> itself — the button
            stays a fixed 56x56 hit-box, so growing this pill under the
            cursor never crosses the hover boundary and can't flicker.
            Hovering this pill still counts as hovering the button since
            it's a DOM descendant.
          */}
          <span
            className={`absolute top-0 right-0 flex h-14 items-center rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-[0_8px_32px_rgba(192,168,79,0.5)] transition-all duration-300 ${
              isDraggingFab ? "" : "hover:scale-105 active:scale-95"
            } ${fabLabelExpanded ? "pl-4 pr-5" : "w-14 justify-center px-0"}`}
          >
            <span className="absolute inset-0 -z-10 rounded-full bg-[#c0a84f] opacity-40 blur-md animate-pulse" />
            <CalendarClock className="h-6 w-6 shrink-0" strokeWidth={2.25} />
            <span
              className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                fabLabelExpanded ? "ml-2 max-w-[110px] opacity-100" : "ml-0 max-w-0 opacity-0"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Free Demo
            </span>
          </span>
        </button>
      )}

      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="inset-x-4 top-auto bottom-4 max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          {/* Close button */}
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close popup</span>
          </DialogClose>

          {/* Header */}
          <div className="relative bg-[#0e2b49] px-6 pt-6 pb-5">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0a84f]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <div className="relative">
              <Badge className="mb-3 gap-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 px-3 py-1 text-[10px] font-semibold text-[#c0a84f] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
                100% Free — No Commitment
              </Badge>
              <DialogTitle
                className="text-white text-xl font-bold leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Book Your{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Free Demo
                </span>{" "}
                Session
              </DialogTitle>
              <DialogDescription className="text-white/55 text-sm mt-1">
                30-min live 1-on-1 session — pick your slot, we&apos;ll
                confirm within 24 hrs.
              </DialogDescription>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <DemoBookingForm
              key={formKey}
              idPrefix="popup"
              initialBookingType={initialBookingType}
              onSuccess={() =>
                localStorage.setItem(STORAGE_KEY, String(Date.now()))
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
