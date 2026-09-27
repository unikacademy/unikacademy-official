"use client";

import { useState, useEffect, useRef, SubmitEvent } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, CheckIcon, XIcon } from "lucide-react";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateCompanyName,
} from "@/shared/validation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const STORAGE_KEY = "unik_demo_popup_dismissed";
const DISMISS_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const SHOW_DELAY_MS = 2500;

const FAB_POSITION_KEY = "unik_demo_fab_position";
const FAB_SIZE = 56; // px, matches h-14 w-14
const FAB_EDGE_MARGIN = 8; // px, keeps it off the very edge of the viewport
const DRAG_THRESHOLD = 6; // px of pointer movement before a press counts as a drag

type BookingType = "individual" | "corporate";
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
  const [visible, setVisible] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>("individual");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    course: "Quick Demo Request",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    companyName?: string;
  }>({});

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

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingType(type);
    setFormData((prev) => ({ ...prev, email: "", companyName: "" }));
    setFieldErrors((prev) => ({
      ...prev,
      email: undefined,
      companyName: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);
    const companyErr =
      bookingType === "corporate"
        ? validateCompanyName(formData.companyName)
        : null;
    const emailErr =
      bookingType === "corporate" ? validateEmail(formData.email) : null;
    if (nameErr || phoneErr || companyErr || emailErr) {
      setFieldErrors({
        name: nameErr ?? undefined,
        phone: phoneErr ?? undefined,
        companyName: companyErr ?? undefined,
        email: emailErr ?? undefined,
      });
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, bookingType }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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
          aria-label="Book a free demo session"
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 touch-none items-center justify-center sm:bottom-6 sm:right-6"
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
          <span className="absolute inset-0 rounded-full bg-[#c0a84f] opacity-40 blur-md animate-pulse" />
          <span
            className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-[0_8px_32px_rgba(192,168,79,0.5)] ${
              isDraggingFab
                ? ""
                : "transition-transform hover:scale-105 active:scale-95"
            }`}
          >
            <CalendarClock className="h-6 w-6" strokeWidth={2.25} />
          </span>
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#c0a84f] ring-2 ring-white animate-pulse" />
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
            {submitStatus === "success" ? (
              <Empty className="p-0 py-6">
                <EmptyHeader>
                  <EmptyMedia className="mb-0 size-14 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] shadow-lg [&_svg]:size-7 [&_svg]:text-[#0e2b49]">
                    <CheckIcon strokeWidth={2.5} />
                  </EmptyMedia>
                  <EmptyTitle
                    className="text-lg font-bold text-[#0e2b49]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {bookingType === "corporate"
                      ? "Request Received!"
                      : "Demo Booked!"}
                  </EmptyTitle>
                  <EmptyDescription className="text-[#64748B] text-sm">
                    {bookingType === "corporate"
                      ? "Our corporate training team will reach out shortly."
                      : "We'll reach out on WhatsApp / phone to confirm your slot."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <ToggleGroup
                  value={[bookingType]}
                  onValueChange={(values) => {
                    const next = values[0] as BookingType | undefined;
                    if (next) handleBookingTypeChange(next);
                  }}
                  className="grid w-full grid-cols-2 gap-1 rounded-xl bg-[#E2E8F0]/60 p-1"
                >
                  <ToggleGroupItem
                    value="individual"
                    className="h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-[#64748B] hover:bg-transparent hover:text-[#0e2b49] data-pressed:bg-white data-pressed:text-[#0e2b49] data-pressed:shadow-sm"
                  >
                    Individual
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="corporate"
                    className="h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-[#64748B] hover:bg-transparent hover:text-[#0e2b49] data-pressed:bg-white data-pressed:text-[#0e2b49] data-pressed:shadow-sm"
                  >
                    Corporate
                  </ToggleGroupItem>
                </ToggleGroup>

                {bookingType === "corporate" && (
                  <Field data-invalid={!!fieldErrors.companyName}>
                    <FieldLabel
                      htmlFor="popup-company"
                      className="text-xs font-semibold text-[#0e2b49]"
                    >
                      Company Name *
                    </FieldLabel>
                    <Input
                      type="text"
                      id="popup-company"
                      name="companyName"
                      autoComplete="organization"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company's name"
                      className="h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50"
                    />
                    <FieldError className="text-xs">
                      {fieldErrors.companyName}
                    </FieldError>
                  </Field>
                )}

                <Field data-invalid={!!fieldErrors.name}>
                  <FieldLabel
                    htmlFor="popup-name"
                    className="text-xs font-semibold text-[#0e2b49]"
                  >
                    {bookingType === "corporate"
                      ? "Contact Person Name *"
                      : "Full Name *"}
                  </FieldLabel>
                  <Input
                    type="text"
                    id="popup-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50"
                  />
                  <FieldError className="text-xs">
                    {fieldErrors.name}
                  </FieldError>
                </Field>

                <Field data-invalid={!!fieldErrors.phone}>
                  <FieldLabel
                    htmlFor="popup-phone"
                    className="text-xs font-semibold text-[#0e2b49]"
                  >
                    Phone Number *
                  </FieldLabel>
                  <Input
                    type="tel"
                    id="popup-phone"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50"
                  />
                  <FieldError className="text-xs">
                    {fieldErrors.phone}
                  </FieldError>
                </Field>

                {bookingType === "corporate" && (
                  <Field data-invalid={!!fieldErrors.email}>
                    <FieldLabel
                      htmlFor="popup-email"
                      className="text-xs font-semibold text-[#0e2b49]"
                    >
                      Business Email *
                    </FieldLabel>
                    <Input
                      type="email"
                      id="popup-email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50"
                    />
                    <FieldError className="text-xs">
                      {fieldErrors.email}
                    </FieldError>
                  </Field>
                )}

                {submitStatus === "error" && (
                  <Alert
                    variant="destructive"
                    className="border-red-100 bg-red-50 px-4 py-2.5"
                  >
                    <AlertDescription className="text-red-500 text-xs">
                      Something went wrong. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-auto w-full gap-2 rounded-xl bg-linear-to-r from-[#c0a84f] to-[#d4bc72] py-3 font-bold text-[#0e2b49] shadow-md hover:from-[#d4bc72] hover:to-[#c0a84f] hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {isSubmitting && <Spinner className="text-[#0e2b49]" />}
                  {isSubmitting
                    ? "Booking..."
                    : bookingType === "corporate"
                      ? "Request Corporate Training"
                      : "Book My Free Demo Session"}
                </Button>
                <p className="text-center text-[#94a3b8] text-[11px]">
                  No payment required &bull; We&apos;ll confirm within 24
                  hours
                </p>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
