"use client";

import { useState, type SubmitEvent } from "react";
import { CheckIcon } from "lucide-react";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateCompanyName,
} from "@/shared/validation";
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
import { cn } from "@/lib/utils";

export type BookingType = "individual" | "corporate";

// Only the color/contrast classes differ between hosts — every field,
// validation rule, and submit behavior below is shared identically.
const VARIANT_STYLES = {
  light: {
    label: "text-xs font-semibold text-[#0e2b49]",
    input:
      "h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50",
    toggleTrack: "grid w-full grid-cols-2 gap-1 rounded-xl bg-[#E2E8F0]/60 p-1",
    toggleItem:
      "h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-[#64748B] hover:bg-transparent hover:text-[#0e2b49] data-pressed:bg-white data-pressed:text-[#0e2b49] data-pressed:shadow-sm",
    alert: "border-red-100 bg-red-50 px-4 py-2.5",
    alertText: "text-red-500 text-xs",
    helperText: "text-center text-[#94a3b8] text-[11px]",
    emptyTitle: "text-lg font-bold text-[#0e2b49]",
    emptyDescription: "text-[#64748B] text-sm",
  },
  dark: {
    label:
      "text-[11px] font-semibold text-white/50 uppercase tracking-widest",
    input:
      "h-auto rounded-xl border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/25 focus-visible:border-[#c0a84f]/50 focus-visible:ring-[#c0a84f]/20",
    toggleTrack: "grid w-full grid-cols-2 gap-1 rounded-xl bg-white/10 p-1",
    toggleItem:
      "h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-white/50 hover:bg-transparent hover:text-white data-pressed:bg-white/15 data-pressed:text-white data-pressed:shadow-sm",
    alert: "border-red-400/30 bg-red-500/10 px-4 py-2.5",
    alertText: "text-red-300 text-xs",
    helperText: "text-center text-white/40 text-[11px]",
    emptyTitle: "text-lg font-bold text-white",
    emptyDescription: "text-white/50 text-sm",
  },
} as const;

export default function DemoBookingForm({
  variant = "light",
  idPrefix = "demo",
  initialBookingType = "individual",
  onSuccess,
  className,
}: {
  variant?: keyof typeof VARIANT_STYLES;
  idPrefix?: string;
  initialBookingType?: BookingType;
  onSuccess?: () => void;
  className?: string;
}) {
  const styles = VARIANT_STYLES[variant];

  const [bookingType, setBookingType] =
    useState<BookingType>(initialBookingType);
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
        onSuccess?.();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <Empty className={cn("p-0 py-6", className)}>
        <EmptyHeader>
          <EmptyMedia className="mb-0 size-14 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] shadow-lg [&_svg]:size-7 [&_svg]:text-[#0e2b49]">
            <CheckIcon strokeWidth={2.5} />
          </EmptyMedia>
          <EmptyTitle
            className={styles.emptyTitle}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {bookingType === "corporate"
              ? "Request Received!"
              : "Demo Booked!"}
          </EmptyTitle>
          <EmptyDescription className={styles.emptyDescription}>
            {bookingType === "corporate"
              ? "Our corporate training team will reach out shortly."
              : "We'll reach out on WhatsApp / phone to confirm your slot."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <ToggleGroup
        value={[bookingType]}
        onValueChange={(values) => {
          const next = values[0] as BookingType | undefined;
          if (next) handleBookingTypeChange(next);
        }}
        className={styles.toggleTrack}
      >
        <ToggleGroupItem value="individual" className={styles.toggleItem}>
          Individual
        </ToggleGroupItem>
        <ToggleGroupItem value="corporate" className={styles.toggleItem}>
          Corporate
        </ToggleGroupItem>
      </ToggleGroup>

      {bookingType === "corporate" && (
        <Field data-invalid={!!fieldErrors.companyName}>
          <FieldLabel
            htmlFor={`${idPrefix}-company`}
            className={styles.label}
          >
            Company Name *
          </FieldLabel>
          <Input
            type="text"
            id={`${idPrefix}-company`}
            name="companyName"
            autoComplete="organization"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your company's name"
            className={styles.input}
          />
          <FieldError className="text-xs">
            {fieldErrors.companyName}
          </FieldError>
        </Field>
      )}

      <Field data-invalid={!!fieldErrors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`} className={styles.label}>
          {bookingType === "corporate"
            ? "Contact Person Name *"
            : "Full Name *"}
        </FieldLabel>
        <Input
          type="text"
          id={`${idPrefix}-name`}
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={styles.input}
        />
        <FieldError className="text-xs">{fieldErrors.name}</FieldError>
      </Field>

      <Field data-invalid={!!fieldErrors.phone}>
        <FieldLabel htmlFor={`${idPrefix}-phone`} className={styles.label}>
          Phone Number *
        </FieldLabel>
        <Input
          type="tel"
          id={`${idPrefix}-phone`}
          name="phone"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          className={styles.input}
        />
        <FieldError className="text-xs">{fieldErrors.phone}</FieldError>
      </Field>

      {bookingType === "corporate" && (
        <Field data-invalid={!!fieldErrors.email}>
          <FieldLabel htmlFor={`${idPrefix}-email`} className={styles.label}>
            Business Email *
          </FieldLabel>
          <Input
            type="email"
            id={`${idPrefix}-email`}
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={styles.input}
          />
          <FieldError className="text-xs">{fieldErrors.email}</FieldError>
        </Field>
      )}

      {submitStatus === "error" && (
        <Alert variant="destructive" className={styles.alert}>
          <AlertDescription className={styles.alertText}>
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
      <p className={styles.helperText}>
        No payment required &bull; We&apos;ll confirm within 24 hours
      </p>
    </form>
  );
}
