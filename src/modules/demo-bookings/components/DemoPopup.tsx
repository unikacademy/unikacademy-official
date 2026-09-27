"use client";

import { useState, useEffect, SubmitEvent } from "react";
import { usePathname } from "next/navigation";
import { CheckIcon, XIcon } from "lucide-react";
import { validateName, validatePhone } from "@/shared/validation";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const STORAGE_KEY = "unik_demo_popup_dismissed";
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const SHOW_DELAY_MS = 2500;

export default function DemoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Quick Demo Request",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

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

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
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
    if (nameErr || phoneErr) {
      setFieldErrors({
        name: nameErr ?? undefined,
        phone: phoneErr ?? undefined,
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
        body: JSON.stringify(formData),
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
              30-min live 1-on-1 session — pick your slot, we&apos;ll confirm
              within 24 hrs.
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
                  Demo Booked!
                </EmptyTitle>
                <EmptyDescription className="text-[#64748B] text-sm">
                  We&apos;ll reach out on WhatsApp / phone to confirm your
                  slot.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field data-invalid={!!fieldErrors.name}>
                <FieldLabel
                  htmlFor="popup-name"
                  className="text-xs font-semibold text-[#0e2b49]"
                >
                  Full Name *
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
                {isSubmitting ? "Booking..." : "Book My Free Demo Session"}
              </Button>
              <p className="text-center text-[#94a3b8] text-[11px]">
                No payment required &bull; We&apos;ll confirm within 24 hours
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
